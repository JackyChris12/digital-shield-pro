#!/bin/bash

# Migration helper script
echo "🚀 Supabase Migration Helper"
echo "================================"
echo ""
echo "📋 Copying migration SQL to clipboard..."

# Copy the SQL file to clipboard (using xclip or xsel if available)
if command -v xclip &> /dev/null; then
    cat supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql | xclip -selection clipboard
    echo "✅ SQL copied to clipboard using xclip!"
elif command -v xsel &> /dev/null; then
    cat supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql | xsel --clipboard
    echo "✅ SQL copied to clipboard using xsel!"
elif command -v pbcopy &> /dev/null; then
    cat supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql | pbcopy
    echo "✅ SQL copied to clipboard using pbcopy!"
else
    echo "⚠️  No clipboard utility found. Please copy manually."
    echo ""
    echo "📄 SQL file location:"
    echo "   $(pwd)/supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql"
fi

echo ""
echo "🌐 Opening Supabase SQL Editor..."
echo ""

# Construct the Supabase SQL editor URL
PROJECT_ID="ypoyhoyuajzaogtmficj"
SQL_EDITOR_URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new"

# Try to open the URL in the default browser
if command -v xdg-open &> /dev/null; then
    xdg-open "$SQL_EDITOR_URL" &> /dev/null &
    echo "✅ Opened in browser!"
elif command -v gnome-open &> /dev/null; then
    gnome-open "$SQL_EDITOR_URL" &> /dev/null &
    echo "✅ Opened in browser!"
elif command -v open &> /dev/null; then
    open "$SQL_EDITOR_URL" &> /dev/null &
    echo "✅ Opened in browser!"
else
    echo "⚠️  Could not auto-open browser. Please visit:"
    echo "   $SQL_EDITOR_URL"
fi

echo ""
echo "📝 Next steps:"
echo "   1. The SQL Editor should now be open in your browser"
echo "   2. If SQL is copied, just paste it (Ctrl+V or Cmd+V)"
echo "   3. If not copied, open: supabase/migrations/APPLY_THIS_IN_DASHBOARD.sql"
echo "   4. Click 'Run' to execute the migration"
echo ""
echo "✨ After running the migration, your 'Add Demo Alert' button will work!"
echo ""
