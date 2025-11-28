import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { location } = await req.json()

        const authHeader = req.headers.get('Authorization')!
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        console.log(`Emergency triggered by user ${user.id}`)

        const { data: event, error: eventError } = await supabaseClient
            .from('emergency_events')
            .insert({
                user_id: user.id,
                location: location || 'Unknown',
                notes: 'Emergency activated',
            })
            .select()
            .single()

        if (eventError) throw eventError

        const { data: contacts, error: contactsError } = await supabaseClient
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', user.id)

        if (contactsError) throw contactsError

        const notifications = []

        for (const contact of contacts) {
            const { data: notification, error: notifError } = await supabaseClient
                .from('emergency_notifications')
                .insert({
                    event_id: event.id,
                    contact_id: contact.id,
                    status: 'pending'
                })
                .select()
                .single()

            if (notifError) {
                console.error(`Failed to create notification for ${contact.name}`)
                continue
            }

            try {
                if (contact.email) {
                    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Deno.env.get('EMAILJS_PRIVATE_KEY')}`
                        },
                        body: JSON.stringify({
                            service_id: 'service_rs94pbc',
                            template_id: 'template_cyfjnsn',
                            template_params: {
                                to_email: contact.email,
                                to_name: contact.name,
                                location: location,
                                time: new Date().toLocaleString()
                            }
                        })
                    })

                    if (emailResponse.ok) {
                        console.log(`Email sent to ${contact.email}`)

                        await supabaseClient
                            .from('emergency_notifications')
                            .update({ status: 'sent', sent_at: new Date().toISOString() })
                            .eq('id', notification.id)

                        notifications.push({ ...notification, status: 'sent' })
                    } else {
                        const errorText = await emailResponse.text()
                        throw new Error(`Email failed: ${errorText}`)
                    }
                } else {
                    await supabaseClient
                        .from('emergency_notifications')
                        .update({ status: 'failed' })
                        .eq('id', notification.id)
                }
            } catch (error) {
                console.error(`Failed to send to ${contact.name}:`, error)
                await supabaseClient
                    .from('emergency_notifications')
                    .update({ status: 'failed' })
                    .eq('id', notification.id)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                event,
                notifications
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
