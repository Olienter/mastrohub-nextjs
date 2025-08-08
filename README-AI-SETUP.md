# AI Provider Setup Guide

## Overview
Our project supports multiple AI providers for the Menu Interview feature. You can choose between OpenAI GPT-4o, Anthropic Claude 3.5, or Ollama (local AI).

## Quick Setup

### 1. OpenAI GPT-4o (Recommended)
```bash
# Add to .env.local
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

**Pros:**
- ✅ Latest and fastest AI model
- ✅ Best for complex reasoning
- ✅ 50% cheaper than GPT-4
- ✅ Multimodal capabilities

**Cons:**
- ❌ Paid per token usage
- ❌ Requires API key

### 2. Anthropic Claude 3.5
```bash
# Add to .env.local
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Pros:**
- ✅ Excellent text understanding
- ✅ Better safety and filtering
- ✅ More consistent responses
- ✅ Less hallucination

**Cons:**
- ❌ Paid per token usage
- ❌ Requires API key

### 3. Ollama (Local AI) - FREE
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2:3b

# Add to .env.local
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

**Pros:**
- ✅ Completely FREE
- ✅ Complete privacy (no data leaves your system)
- ✅ No API limits
- ✅ Full control over the model

**Cons:**
- ❌ Requires local installation
- ❌ Slower than cloud providers
- ❌ Limited model selection

## Installation Steps

### Option 1: OpenAI (Recommended for Production)
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the development server

### Option 2: Anthropic
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env.local`:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Restart the development server

### Option 3: Ollama (Free Local AI)
1. Install Ollama:
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. Start Ollama and pull a model:
   ```bash
   ollama serve
   ollama pull llama3.2:3b
   ```

3. Add to `.env.local`:
   ```
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   ```

4. Restart the development server

## Usage

### In the Menu Maker
1. Click "AI Interview" button
2. Select your preferred AI provider
3. Answer 15 intelligent questions
4. Get 7 comprehensive manuals automatically generated

### Provider Selection
The system will automatically detect available providers based on your configuration:
- If you have OpenAI API key → OpenAI available
- If you have Anthropic API key → Anthropic available  
- If Ollama is running → Ollama available

## Cost Comparison

| Provider | Cost | Speed | Quality |
|----------|------|-------|---------|
| OpenAI GPT-4o | ~$0.01/1K tokens | Very Fast | Excellent |
| Anthropic Claude | ~$0.015/1K tokens | Fast | Excellent |
| Ollama (Local) | FREE | Medium | Good |

## Troubleshooting

### OpenAI Issues
- Check API key is valid
- Ensure you have credits in your account
- Verify the model name is correct

### Anthropic Issues
- Check API key format (starts with `sk-ant-`)
- Ensure you have credits in your account
- Verify the model name is correct

### Ollama Issues
- Ensure Ollama is running: `ollama serve`
- Check if model is downloaded: `ollama list`
- Verify the base URL is correct

### General Issues
- Check browser console for errors
- Verify environment variables are loaded
- Restart the development server after config changes

## Development vs Production

### Development
- Use Ollama for free local development
- Mock responses when no provider is configured
- Easy to switch between providers

### Production
- Use OpenAI GPT-4o for best performance
- Implement proper error handling
- Add rate limiting and usage tracking
- Consider cost optimization strategies

## Advanced Configuration

### Custom Models
You can modify the model names in `src/lib/ai-provider.ts`:
```typescript
// OpenAI
model: 'gpt-4o' // or 'gpt-4-turbo'

// Anthropic  
model: 'claude-3-5-sonnet-20241022' // or 'claude-3-haiku-20240307'

// Ollama
model: 'llama3.2:3b' // or 'mistral:7b', 'codellama:7b'
```

### Temperature Settings
Adjust creativity vs consistency:
```typescript
temperature: 0.7 // Higher = more creative, Lower = more consistent
```

### Token Limits
Control response length:
```typescript
max_tokens: 2000 // Adjust based on your needs
```

## Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Monitor usage for unexpected charges

### Data Privacy
- Ollama: Complete privacy (local only)
- OpenAI/Anthropic: Data may be used for training
- Consider data retention policies

## Performance Optimization

### Caching
Implement response caching to reduce API calls:
```typescript
// Cache common responses
const cache = new Map()
```

### Rate Limiting
Prevent API abuse:
```typescript
// Implement rate limiting
const rateLimiter = new Map()
```

### Cost Monitoring
Track usage to optimize costs:
```typescript
// Log token usage
console.log(`Tokens used: ${response.usage?.total_tokens}`)
```

## Support

For issues with:
- **OpenAI**: Check [OpenAI Documentation](https://platform.openai.com/docs)
- **Anthropic**: Check [Anthropic Documentation](https://docs.anthropic.com/)
- **Ollama**: Check [Ollama Documentation](https://ollama.ai/docs)

For project-specific issues, check the browser console and server logs.
