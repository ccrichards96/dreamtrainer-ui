# Post Component Setup for Storyblok - Preline UI

This document provides complete setup instructions for the enhanced Post component that follows Preline UI blog article design patterns.

## Overview

The updated Post component provides a modern, professional blog article layout with:

- **Preline UI Design Patterns**: Following industry-standard blog article layouts
- **Flexible Layout Options**: Hero style or simple article layout
- **Enhanced Author Profiles**: Rich author information with tooltips
- **Social Engagement**: Like, comment, and share functionality
- **Responsive Design**: Mobile-first approach with professional typography
- **Content Flexibility**: Support for rich text, nested components, and tags

## Storyblok Component Configuration

### 1. Create the Post Component in Storyblok

1. Navigate to your Storyblok space
2. Go to **Components** in the left sidebar
3. Click **+ New** to create a new component
4. Name it `post` (lowercase, matching your component file name)
5. Set the component type to **Content type** (for full page articles)

### 2. Component Schema Fields

Add the following fields to your Post component in Storyblok:

#### Basic Content Fields

| Field Name  | Field Type | Description               | Default Value |
| ----------- | ---------- | ------------------------- | ------------- |
| `title`     | Text       | Article title             | Required      |
| `intro`     | Textarea   | Article subtitle/intro    | Optional      |
| `image`     | Asset      | Featured article image    | Optional      |
| `category`  | Text       | Article category          | Optional      |
| `long_text` | Rich Text  | Main article content      | Required      |
| `blocks`    | Blocks     | Additional content blocks | Optional      |

#### Author Information Fields

| Field Name       | Field Type | Description                        | Default Value |
| ---------------- | ---------- | ---------------------------------- | ------------- |
| `author`         | Text       | Author name (legacy support)       | Optional      |
| `author_image`   | Asset      | Author image (legacy support)      | Optional      |
| `author_details` | Blocks     | Enhanced author information        | Optional      |
| `date`           | Text       | Publication date                   | Optional      |
| `read_time`      | Text       | Estimated reading time (e.g., "5") | Optional      |

#### Layout & Display Options

| Field Name            | Field Type    | Description                 | Options/Default                                                |
| --------------------- | ------------- | --------------------------- | -------------------------------------------------------------- |
| `layout_style`        | Single-Option | Article layout style        | Options: `hero`, `simple` (Default: `simple`)                  |
| `container_max_width` | Single-Option | Content container width     | Options: `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` (Default: `3xl`) |
| `show_breadcrumbs`    | Boolean       | Show navigation breadcrumbs | Default: `true`                                                |
| `show_social_share`   | Boolean       | Show social share buttons   | Default: `false`                                               |
| `show_sticky_share`   | Boolean       | Show sticky share bar       | Default: `false`                                               |

#### Social Engagement Fields

| Field Name       | Field Type | Description        | Default Value |
| ---------------- | ---------- | ------------------ | ------------- |
| `likes_count`    | Text       | Number of likes    | Optional      |
| `comments_count` | Text       | Number of comments | Optional      |

#### Tags & Categories

| Field Name | Field Type | Description  | Default Value |
| ---------- | ---------- | ------------ | ------------- |
| `tags`     | Blocks     | Article tags | Optional      |

### 3. Author Details Block Configuration

Create a new nestable block called `author_details`:

| Field Name        | Field Type | Description                | Default Value |
| ----------------- | ---------- | -------------------------- | ------------- |
| `name`            | Text       | Author full name           | Required      |
| `bio`             | Textarea   | Author biography           | Optional      |
| `image`           | Asset      | Author profile photo       | Optional      |
| `articles_count`  | Text       | Number of articles written | Optional      |
| `followers_count` | Text       | Social media followers     | Optional      |
| `social_links`    | Blocks     | Social media links         | Optional      |

### 4. Tag Block Configuration

Create a new nestable block called `tag`:

| Field Name | Field Type | Description      | Default Value |
| ---------- | ---------- | ---------------- | ------------- |
| `name`     | Text       | Tag name         | Required      |
| `url`      | Link       | Optional tag URL | Optional      |

### 5. Social Link Block Configuration

Create a new nestable block called `social_link`:

| Field Name | Field Type    | Description     | Default Value                                           |
| ---------- | ------------- | --------------- | ------------------------------------------------------- |
| `platform` | Single-Option | Social platform | Options: `twitter`, `facebook`, `linkedin`, `instagram` |
| `url`      | Link          | Profile URL     | Required                                                |

### 6. Field Configuration Details

#### Single-Option Field Setup

**layout_style Options:**

```
simple|Simple Article Layout
hero|Hero Banner Layout
```

**container_max_width Options:**

```
sm|Small (384px)
md|Medium (448px)
lg|Large (512px)
xl|Extra Large (576px)
2xl|2X Large (672px)
3xl|3X Large (768px)
```

### 7. Component Preview Configuration

Add this preview configuration to your Post component in Storyblok:

```javascript
{
  "title": "Announcing a free plan for small teams",
  "intro": "At Preline, our mission has always been focused on bringing openness and transparency to the design process.",
  "image": {
    "filename": "https://images.unsplash.com/photo-1670272505340-d906d8d77d03?auto=format&fit=crop&w=800&q=80"
  },
  "category": "Product Updates",
  "date": "Jan 18, 2024",
  "read_time": "8",
  "layout_style": "simple",
  "show_breadcrumbs": true,
  "show_social_share": true,
  "container_max_width": "3xl",
  "author_details": [{
    "component": "author_details",
    "name": "Leyla Ludic",
    "bio": "Customer Success Specialist at Preline who speaks to in-house recruiters worldwide.",
    "image": {
      "filename": "https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
    },
    "articles_count": "56",
    "followers_count": "1k+"
  }],
  "tags": [
    {
      "component": "tag",
      "name": "Product",
      "url": "/tags/product"
    },
    {
      "component": "tag",
      "name": "Free Plan"
    }
  ]
}
```

## Usage Examples

### 1. Simple Article Layout

```json
{
  "title": "Getting Started with Our Platform",
  "intro": "A comprehensive guide to help you make the most of our features.",
  "layout_style": "simple",
  "show_breadcrumbs": true,
  "container_max_width": "2xl",
  "author_details": [
    {
      "component": "author_details",
      "name": "John Doe",
      "image": { "filename": "https://example.com/author.jpg" }
    }
  ],
  "date": "March 15, 2024",
  "read_time": "5"
}
```

### 2. Hero Article Layout

```json
{
  "title": "The Future of Web Development",
  "intro": "Exploring emerging trends and technologies shaping tomorrow's web.",
  "image": { "filename": "https://example.com/hero-image.jpg" },
  "layout_style": "hero",
  "show_social_share": true,
  "show_sticky_share": true,
  "container_max_width": "3xl"
}
```

### 3. Article with Enhanced Author Profile

```json
{
  "title": "Advanced CSS Techniques",
  "author_details": [
    {
      "component": "author_details",
      "name": "Sarah Wilson",
      "bio": "Senior Frontend Developer with 8+ years experience in modern web technologies.",
      "image": { "filename": "https://example.com/sarah.jpg" },
      "articles_count": "42",
      "followers_count": "2.5k",
      "social_links": [
        {
          "component": "social_link",
          "platform": "twitter",
          "url": "https://twitter.com/sarahwilson"
        }
      ]
    }
  ],
  "show_social_share": true
}
```

## Best Practices

### 1. Content Strategy

- Use **simple layout** for standard articles
- Use **hero layout** for featured or announcement posts
- Keep article titles under 60 characters for SEO
- Write compelling intro text (150-200 characters)

### 2. Author Profiles

- Always include author name and image
- Add bio for thought leadership content
- Use article/follower counts for credibility
- Link to author social profiles when appropriate

### 3. Social Features

- Enable sticky share for long-form content
- Use social share buttons strategically
- Monitor engagement metrics through likes/comments

### 4. Performance

- Optimize featured images (recommended: 1200x630px)
- Use appropriate container widths for readability
- Lazy load non-critical content

### 5. SEO Optimization

- Use descriptive titles and intros
- Implement proper heading hierarchy in rich text
- Add relevant tags for content discoverability
- Include publication dates for freshness

## Advanced Features

### 1. Custom Rich Text Blocks

The component supports nested Storyblok blocks within the article content:

- Image galleries
- Quote blocks
- Call-to-action sections
- Code snippets
- Video embeds

### 2. Social Integration

- Like functionality (ready for backend integration)
- Comment system integration points
- Social sharing with platform-specific optimization
- Author social profile linking

### 3. Analytics Ready

- Event tracking points for user engagement
- Reading time calculation
- Social interaction monitoring
- Author profile view tracking

## Troubleshooting

### Common Issues

**Author tooltip not showing:**

- Ensure Preline UI JavaScript is loaded
- Check for CSS conflicts with tooltip classes
- Verify author_details block structure

**Layout not responsive:**

- Check container_max_width setting
- Verify Tailwind CSS responsive classes
- Test on different screen sizes

**Social sharing not working:**

- Implement onClick handlers for production use
- Add proper URL generation for social platforms
- Test share functionality across different browsers

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Touch-friendly on mobile devices

## Migration from Legacy Version

If upgrading from the previous Post component:

1. **Gradual Migration**: Legacy `author` and `author_image` fields still work
2. **Enhanced Features**: Add new fields progressively
3. **Layout Preservation**: Default layout matches previous behavior
4. **Content Safety**: Existing rich text content renders unchanged

The component provides automatic fallbacks and maintains backward compatibility while offering enhanced features for new content.

## Support

For questions about this component:

1. Review the Preline UI documentation for styling references
2. Check Storyblok documentation for content management
3. Test configurations in Storyblok's visual editor
4. Validate responsive behavior across devices
