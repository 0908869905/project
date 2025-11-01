#!/bin/bash

# Demo script to test the sign language translation API
# Make sure backend is running on http://localhost:3001

API_URL="${API_URL:-http://localhost:3001}"

echo "🧪 Testing Sign Language Translation API"
echo "========================================"
echo ""

# Test 1: Health Check
echo "📡 Test 1: Health Check"
echo "GET ${API_URL}/api/health"
curl -s "${API_URL}/api/health" | jq '.' || echo "❌ Failed (is backend running?)"
echo ""
echo ""

# Test 2: Translate text to gloss
echo "📝 Test 2: Translate Chinese to TSL Gloss"
echo "POST ${API_URL}/api/translate"
echo '{"text": "你好"}' | curl -s -X POST "${API_URL}/api/translate" \
  -H "Content-Type: application/json" \
  -d @- | jq '.'
echo ""
echo ""

# Test 3: Complete translation (note: this will call OpenAI API)
echo "🎨 Test 3: Complete Translation (requires OpenAI API Key)"
echo "POST ${API_URL}/api/translate-complete"
echo "⚠️  This test requires a valid OpenAI API key and will use credits"
echo "Skipping by default. Uncomment to test:"
echo ""
# Uncomment to test (will use OpenAI credits):
# echo '{"text": "你好"}' | curl -s -X POST "${API_URL}/api/translate-complete" \
#   -H "Content-Type: application/json" \
#   -d @- | jq '.'
echo ""

# Test 4: Submit feedback
echo "💬 Test 4: Submit Feedback"
echo "POST ${API_URL}/api/postprocess"
echo '{"imageUrl": "http://example.com/image.png", "feedback": "like"}' | \
  curl -s -X POST "${API_URL}/api/postprocess" \
  -H "Content-Type: application/json" \
  -d @- | jq '.'
echo ""
echo ""

# Test 5: Get stats
echo "📊 Test 5: Get Feedback Stats"
echo "GET ${API_URL}/api/stats"
curl -s "${API_URL}/api/stats" | jq '.'
echo ""
echo ""

echo "✅ API Tests Complete!"
echo ""
echo "💡 Tips:"
echo "  - Make sure backend is running: npm run dev:backend"
echo "  - Set OPENAI_API_KEY in apps/backend/.env for full functionality"
echo "  - Frontend available at: http://localhost:3000"
