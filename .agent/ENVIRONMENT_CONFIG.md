# Environment Capabilities

This file documents the tools and capabilities available in the current development environment.

## Installed Tools (macOS)
- **Homebrew**: Installed and configured in `.zprofile`.
- **FFmpeg**: Installed. Capable of video processing, compression, format conversion, and audio extraction.
- **ImageMagick**: Installed. Capable of image resizing, format conversion (WebP/AVIF), and manipulation.

## Usage
When working on this project, the agent can assume these tools are available in the terminal path and can be invoked directly (e.g., `ffmpeg -i input.mp4 ...`, `magick input.jpg output.webp`).

## Maintenance
To update these tools in the future, run:
```bash
brew upgrade ffmpeg imagemagick
```

## Last Verified
Date: 2026-01-08
Status: Operational
