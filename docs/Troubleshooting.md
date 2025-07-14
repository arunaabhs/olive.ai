## 🐛 Troubleshooting

### Common Issues

#### **WebSocket Connection Failed**
- Check if you're behind a corporate firewall
- Try using a different WebSocket provider URL
- Ensure your browser supports WebSockets

#### **AI API Not Working**
- Verify API keys are correctly set in `.env`
- Check API key permissions and quotas
- Ensure network connectivity to AI services

#### **Supabase Authentication Issues**
- Verify Supabase URL and anon key
- Check if email confirmation is disabled for development
- Ensure redirect URLs are configured correctly

#### **Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Verify all environment variables are set

### Performance Optimization

1. **Large Files**: Use virtual scrolling for large files
2. **Memory Usage**: Close unused tabs and clear terminal history
3. **Network**: Use WebSocket compression for better performance
4. **Collaboration**: Limit concurrent collaborators for better performance
