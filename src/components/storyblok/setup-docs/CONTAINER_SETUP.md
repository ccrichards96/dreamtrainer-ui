# Storyblok Container Component

A Storyblok component that implements Preline CSS container design patterns using Tailwind CSS. This component provides a flexible container system that follows Preline's container guidelines for responsive design.

## Features

- **Responsive Container Support**: Control container behavior at different breakpoints
- **Max-Width Control**: Set specific max-width values (sm, md, lg, xl, 2xl, full, none)
- **Auto-Centering**: Option to center containers using `mx-auto`
- **Flexible Padding**: Custom horizontal and vertical padding support
- **Background Colors**: Support for custom background colors
- **Custom Classes**: Add additional Tailwind classes as needed
- **Nested Content**: Support for any nested Storyblok components

## Implementation

The Container component has been implemented in `src/components/storyblok/Container.tsx` and registered in the Storyblok configuration at `src/utils/storyblok.ts`.

## Storyblok Schema Configuration

To use this component in Storyblok, you need to create a new block with the following schema:

### Block Configuration

1. **Block Name**: `container`
2. **Display Name**: `Container`
3. **Block Type**: `nestable`

### Field Schema

Add the following fields to your Container block in Storyblok:

```json
{
  "tab": "main",
  "fields": [
    {
      "field": {
        "type": "bloks",
        "required": false,
        "component_whitelist": [],
        "restrict_components": false
      },
      "name": "content",
      "display_name": "Content"
    },
    {
      "field": {
        "type": "option",
        "required": false,
        "options": [
          {
            "name": "None",
            "value": "none"
          },
          {
            "name": "Small (max-w-sm)",
            "value": "sm"
          },
          {
            "name": "Medium (max-w-md)",
            "value": "md"
          },
          {
            "name": "Large (max-w-lg)",
            "value": "lg"
          },
          {
            "name": "Extra Large (max-w-xl)",
            "value": "xl"
          },
          {
            "name": "2X Large (max-w-2xl)",
            "value": "2xl"
          },
          {
            "name": "Full Width",
            "value": "full"
          }
        ],
        "default_value": "none"
      },
      "name": "maxWidth",
      "display_name": "Max Width"
    },
    {
      "field": {
        "type": "boolean",
        "required": false,
        "default_value": true
      },
      "name": "centerContainer",
      "display_name": "Center Container"
    },
    {
      "field": {
        "type": "text",
        "required": false,
        "description": "Horizontal padding (e.g., 1rem, 20px, 4)"
      },
      "name": "horizontalPadding",
      "display_name": "Horizontal Padding"
    },
    {
      "field": {
        "type": "text",
        "required": false,
        "description": "Vertical padding (e.g., 1rem, 20px, 4)"
      },
      "name": "verticalPadding",
      "display_name": "Vertical Padding"
    },
    {
      "field": {
        "type": "text",
        "required": false,
        "description": "Margin (e.g., 1rem, 20px, auto)"
      },
      "name": "margin",
      "display_name": "Margin"
    },
    {
      "field": {
        "type": "option",
        "required": false,
        "options": [
          {
            "name": "None",
            "value": "none"
          },
          {
            "name": "Small (sm:container)",
            "value": "sm"
          },
          {
            "name": "Medium (md:container)",
            "value": "md"
          },
          {
            "name": "Large (lg:container)",
            "value": "lg"
          },
          {
            "name": "Extra Large (xl:container)",
            "value": "xl"
          },
          {
            "name": "2X Large (2xl:container)",
            "value": "2xl"
          }
        ],
        "default_value": "none"
      },
      "name": "responsiveBreakpoint",
      "display_name": "Responsive Breakpoint"
    },
    {
      "field": {
        "type": "text",
        "required": false,
        "description": "Background color (e.g., #ffffff, rgb(255,255,255))"
      },
      "name": "backgroundColor",
      "display_name": "Background Color"
    },
    {
      "field": {
        "type": "text",
        "required": false,
        "description": "Additional Tailwind CSS classes"
      },
      "name": "customClasses",
      "display_name": "Custom Classes"
    }
  ]
}
```

## Setup Instructions

### 1. Add the Container Block in Storyblok

1. Go to your Storyblok space
2. Navigate to **Block Library**
3. Click **+ New** to create a new block
4. Set the following:
   - **Name**: `container`
   - **Display name**: `Container`
   - **Block type**: `Nestable`
5. Add each field from the schema above:
   - Click **+ Add field**
   - Configure each field according to the JSON schema
   - Save the field
6. **Save** the block

### 2. Configure Field Details

#### Content Field

- **Type**: Blocks
- **Name**: `content`
- **Display Name**: `Content`
- **Required**: No
- **Component Whitelist**: Leave empty to allow all components

#### Max Width Field

- **Type**: Single-Option
- **Name**: `maxWidth`
- **Display Name**: `Max Width`
- **Options**: Add each option from the schema
- **Default**: `none`

#### Center Container Field

- **Type**: Boolean
- **Name**: `centerContainer`
- **Display Name**: `Center Container`
- **Default**: `true`

#### Padding Fields

- **Type**: Text
- **Name**: `horizontalPadding` / `verticalPadding`
- **Display Name**: `Horizontal Padding` / `Vertical Padding`
- **Description**: Add usage examples

#### Responsive Breakpoint Field

- **Type**: Single-Option
- **Name**: `responsiveBreakpoint`
- **Display Name**: `Responsive Breakpoint`
- **Options**: Add breakpoint options
- **Default**: `none`

#### Background Color Field

- **Type**: Text
- **Name**: `backgroundColor`
- **Display Name**: `Background Color`
- **Description**: "Background color (e.g., #ffffff, rgb(255,255,255))"

#### Custom Classes Field

- **Type**: Text
- **Name**: `customClasses`
- **Display Name**: `Custom Classes`
- **Description**: "Additional Tailwind CSS classes"

### 3. Update Component Whitelist (Optional)

If you want to restrict which components can be nested inside the Container:

1. Edit the **Content** field in your Container block
2. In **Component Whitelist**, add the component names you want to allow
3. Check **Restrict to whitelist** to enforce the restriction

## Usage Examples

### Basic Centered Container

```tsx
// In Storyblok:
// - maxWidth: "lg"
// - centerContainer: true
// - horizontalPadding: "1rem"

// Renders as:
<div class="w-full container max-w-lg mx-auto px-[1rem]">
  <!-- nested content -->
</div>
```

### Responsive Container

```tsx
// In Storyblok:
// - responsiveBreakpoint: "md"
// - centerContainer: true
// - horizontalPadding: "2rem"

// Renders as:
<div class="w-full md:container md:mx-auto px-[2rem]">
  <!-- nested content -->
</div>
```

### Full-Width Container with Background

```tsx
// In Storyblok:
// - maxWidth: "full"
// - backgroundColor: "#f3f4f6"
// - verticalPadding: "4rem"

// Renders as:
<div class="w-full py-[4rem] bg-[#f3f4f6]">
  <!-- nested content -->
</div>
```

## Best Practices

1. **Use Responsive Breakpoints**: For fluid-to-container layouts, use the responsive breakpoint option
2. **Consistent Padding**: Use consistent padding values across your design system
3. **Semantic Colors**: Use your design system's color tokens for background colors
4. **Test Responsiveness**: Always test container behavior across different screen sizes
5. **Nested Components**: Container works well with Row, Column, and other layout components

## Troubleshooting

### Container Not Centering

- Ensure `centerContainer` is set to `true`
- Check that you're not overriding margin with custom classes

### Padding Not Applied

- Verify padding values use valid CSS units (px, rem, em)
- Check for conflicts with custom classes

### Component Not Rendering

- Ensure the Container component is imported and registered in `utils/storyblok.ts`
- Verify the block name in Storyblok matches the component key (`container`)

## Related Components

- **Row**: For horizontal layouts within containers
- **Column**: For vertical layouts and responsive columns
- **Grid**: For complex grid layouts
- **Hero**: For hero sections that often use containers
