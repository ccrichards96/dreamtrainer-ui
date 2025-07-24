# Image Component Setup for Storyblok

This document provides complete setup instructions for the enhanced Image component that follows Preline UI design patterns.

## Overview

The updated Image component provides comprehensive image handling capabilities including:
- Responsive image behavior following Preline UI patterns
- Advanced styling options (shadows, borders, hover effects)
- Object fit controls for proper image scaling
- Aspect ratio management
- Overlay support
- Performance optimizations (lazy loading)

## Storyblok Component Configuration

### 1. Create the Image Component in Storyblok

1. Navigate to your Storyblok space
2. Go to **Components** in the left sidebar
3. Click **+ New** to create a new component
4. Name it `image` (lowercase, matching your component file name)
5. Set the component type to **Nestable** (if you want it to be used inside other components)

### 2. Component Schema Fields

Add the following fields to your Image component in Storyblok:

#### Required Fields

| Field Name | Field Type | Description | Default Value |
|------------|------------|-------------|---------------|
| `image_url` | Asset | The image file | Required |
| `alt` | Text | Alt text for accessibility | Empty |

#### Layout & Sizing Fields

| Field Name | Field Type | Description | Options/Default |
|------------|------------|-------------|-----------------|
| `width` | Text | Custom width (e.g., "300px", "100%") | Empty |
| `height` | Text | Custom height (e.g., "200px", "auto") | Empty |
| `boxsize_base` | Text | Square dimensions (e.g., "64px") | Empty |
| `maxWidth` | Text | Maximum width constraint | Empty |
| `aspectRatio` | Single-Option | Predefined aspect ratios | Options: `auto`, `square`, `video`, `photo` |

#### Visual Design Fields

| Field Name | Field Type | Description | Options/Default |
|------------|------------|-------------|-----------------|
| `objectFit` | Single-Option | How image fits container | Options: `cover`, `contain`, `fill`, `scale-down`, `none` (Default: `cover`) |
| `rounded` | Single-Option | Border radius | Options: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full` |
| `borderRadius` | Text | Custom border radius (legacy support) | Empty |
| `shadow` | Single-Option | Drop shadow | Options: `none`, `sm`, `md`, `lg`, `xl`, `2xl` |

#### Interactive Effects

| Field Name | Field Type | Description | Options/Default |
|------------|------------|-------------|-----------------|
| `hoverEffect` | Single-Option | Hover animation | Options: `none`, `zoom`, `opacity`, `scale` |

#### Performance & Display

| Field Name | Field Type | Description | Options/Default |
|------------|------------|-------------|-----------------|
| `loading` | Single-Option | Loading behavior | Options: `lazy`, `eager` (Default: `lazy`) |
| `displayMode` | Single-Option | CSS display property | Options: `block`, `inline` (Default: `block`) |

#### Container & Overlay

| Field Name | Field Type | Description | Options/Default |
|------------|------------|-------------|-----------------|
| `containerBackground` | Text | Background color class | Empty |
| `overlay` | Boolean | Enable image overlay | Default: `false` |
| `overlayColor` | Text | Overlay color class | Default: `black` |
| `overlayOpacity` | Single-Option | Overlay transparency | Options: `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90` |

### 3. Field Configuration Details

#### Single-Option Field Setup

For dropdown fields, configure the options as follows:

**aspectRatio Options:**
```
auto|Auto
square|Square (1:1)
video|Video (16:9)
photo|Photo (4:3)
```

**objectFit Options:**
```
cover|Cover (crop to fit)
contain|Contain (fit entirely)
fill|Fill (stretch to fit)
scale-down|Scale Down
none|Original Size
```

**rounded Options:**
```
none|No Rounding
sm|Small
md|Medium
lg|Large
xl|Extra Large
2xl|2X Large
full|Fully Rounded
```

**shadow Options:**
```
none|No Shadow
sm|Small Shadow
md|Medium Shadow
lg|Large Shadow
xl|Extra Large Shadow
2xl|2X Large Shadow
```

**hoverEffect Options:**
```
none|No Effect
zoom|Zoom In (105%)
opacity|Fade Effect
scale|Scale Up (110%)
```

**loading Options:**
```
lazy|Lazy Load
eager|Load Immediately
```

**displayMode Options:**
```
block|Block Display
inline|Inline Display
```

**overlayOpacity Options:**
```
10|10%
20|20%
30|30%
40|40%
50|50%
60|60%
70|70%
80|80%
90|90%
```

### 4. Component Preview Configuration

Add this preview configuration to your Image component in Storyblok:

```javascript
{
  "image_url": {
    "filename": "https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "alt": "Sample image",
  "objectFit": "cover",
  "aspectRatio": "video",
  "rounded": "lg",
  "shadow": "md",
  "hoverEffect": "zoom"
}
```

## Usage Examples

### Basic Image
```json
{
  "image_url": {
    "filename": "https://example.com/image.jpg"
  },
  "alt": "Product photo",
  "width": "400px",
  "height": "300px"
}
```

### Responsive Square Thumbnail
```json
{
  "image_url": {
    "filename": "https://example.com/avatar.jpg"
  },
  "alt": "User avatar",
  "aspectRatio": "square",
  "objectFit": "cover",
  "rounded": "full",
  "shadow": "md",
  "maxWidth": "200px"
}
```

### Hero Image with Overlay
```json
{
  "image_url": {
    "filename": "https://example.com/hero.jpg"
  },
  "alt": "Hero background",
  "aspectRatio": "video",
  "objectFit": "cover",
  "overlay": true,
  "overlayOpacity": "40",
  "hoverEffect": "zoom"
}
```

### Gallery Image with Hover Effect
```json
{
  "image_url": {
    "filename": "https://example.com/gallery-item.jpg"
  },
  "alt": "Gallery photo",
  "aspectRatio": "square",
  "objectFit": "cover",
  "rounded": "lg",
  "shadow": "lg",
  "hoverEffect": "scale"
}
```

## Best Practices

### 1. Performance
- Use `loading: "lazy"` for images below the fold
- Use `loading: "eager"` for above-the-fold images
- Optimize image sizes before uploading to Storyblok

### 2. Accessibility
- Always provide meaningful `alt` text
- Use descriptive alt text that conveys the image's purpose
- Leave `alt` empty for decorative images

### 3. Responsive Design
- Use `aspectRatio` to maintain consistent layouts
- Set `maxWidth` to prevent images from becoming too large
- Use `objectFit: "cover"` for most responsive scenarios

### 4. Visual Consistency
- Use consistent `rounded` and `shadow` values across your site
- Define a limited set of hover effects for your design system
- Use overlay sparingly for better performance

### 5. Content Strategy
- Create image style presets for common use cases
- Document your organization's image standards
- Use consistent aspect ratios across similar content types

## Troubleshooting

### Common Issues

**Images not displaying:**
- Verify the `image_url.filename` is properly set
- Check that the image URL is accessible
- Ensure the component is properly registered in your app

**Styling not applied:**
- Verify Tailwind CSS classes are available
- Check that custom arbitrary values are properly escaped
- Ensure the component is receiving the correct props

**Performance issues:**
- Use appropriate image sizes
- Enable lazy loading for non-critical images
- Optimize images before upload

### Tailwind CSS Dependencies

Ensure these Tailwind CSS features are enabled in your configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    // ... your content paths
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  // Enable arbitrary values
  safelist: [
    // Add commonly used arbitrary values
    { pattern: /^w-\[.+\]$/ },
    { pattern: /^h-\[.+\]$/ },
    { pattern: /^rounded-\[.+\]$/ },
    { pattern: /^max-w-\[.+\]$/ },
  ],
}
```

## Migration from Legacy Version

If you're upgrading from the previous Image component:

1. Existing `borderRadius` fields will continue to work
2. Add new fields gradually to avoid breaking existing content
3. The component provides sensible defaults for all new features
4. Test thoroughly with existing content before deploying

## Support

For additional support or questions about this component:
1. Check the Storyblok documentation
2. Review the Preline UI documentation for styling references
3. Test your configuration in Storyblok's visual editor
