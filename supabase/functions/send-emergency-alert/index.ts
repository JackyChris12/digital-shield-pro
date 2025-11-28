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

        // 1. Create Emergency Event
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

        // 2. Get Contacts
        const { data: contacts, error: contactsError } = await supabaseClient
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', user.id)

        if (contactsError) throw contactsError

        const notifications = []

        // 3. Send emails
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
                    // Send email via Resend
                    const emailResponse = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Aegis Emergency <onboarding@resend.dev>',
                            to: [contact.email],
                            subject: '🚨 EMERGENCY ALERT',
                            html: `
                <h1 style="color: #dc2626;">🚨 Emergency Alert</h1>
                <p><strong>${contact.name}</strong>, someone in your Safe Circle needs help!</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p>Please check on them immediately.</p>
              `
                        })
                    })

                    if (!emailResponse.ok) {
                        throw new Error('Email failed')
                    }

                    console.log(`✅ Email sent to ${contact.email}`)

                    await supabaseClient
                        .from('emergency_notifications')
                        .update({ status: 'sent', sent_at: new Date().toISOString() })
                        .eq('id', notification.id)

                    notifications.push({ ...notification, status: 'sent' })
                } else {
                    // No email, mark as failed
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
            JSON.stringify({ success: true, event, notifications }),
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
