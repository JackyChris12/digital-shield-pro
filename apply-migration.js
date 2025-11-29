import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

// Read the migration SQL file
const migrationPath = join(__dirname, 'supabase', 'migrations', 'APPLY_THIS_IN_DASHBOARD.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// Create Supabase client with service role (we're using anon key, which has limited permissions)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function applyMigration() {
    console.log('🚀 Starting migration...\n');
    console.log('📝 Migration file:', migrationPath);
    console.log('🔗 Supabase URL:', SUPABASE_URL);
    console.log('\n⚠️  NOTE: This requires service_role key for full permissions.');
    console.log('⚠️  The anon key has limited permissions due to RLS.\n');

    try {
        // Split SQL into individual statements (basic approach)
        const statements = migrationSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--') && s !== '');

        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';
            if (statement.length < 50) {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
            } else {
                console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
            }

            const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

            if (error) {
                console.error(`❌ Error in statement ${i + 1}:`, error.message);
                console.error('Statement:', statement.substring(0, 200));
            } else {
                console.log(`✅ Statement ${i + 1} executed successfully`);
            }
        }

        console.log('\n✅ Migration completed!');
        console.log('\n💡 If you see permission errors, you need to:');
        console.log('   1. Go to your Supabase Dashboard');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Copy and paste the SQL from APPLY_THIS_IN_DASHBOARD.sql');
        console.log('   4. Run it manually with full admin permissions');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.log('\n💡 Manual migration required:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/ypoyhoyuajzaogtmficj/sql/new');
        console.log('   2. Copy the SQL from: supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql');
        console.log('   3. Paste and run it in the SQL Editor');
        process.exit(1);
    }
}

applyMigration();
