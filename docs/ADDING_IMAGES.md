# Adding Images to Quizzes

You can now add images to your quizzes using Wikimedia Commons URLs!

## How to Add Images

Add an `images` array to your quiz object in `data/quizzes.json`. The images will be displayed above the questions section.

### Example Structure

```json
{
  "id": "2025-10-28",
  "date": "2025-10-28",
  "title": "Tirsdag, 28. oktober 2025",
  "edition": 1,
  "images": [
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Pope_Leo_XIV_3_%283x4_cropped%29.png"
  ],
  "questions": [
    {
      "number": 1,
      "question": "Hva er hovedstaden i Norge?",
      "answer": "Oslo"
    }
    // ... more questions
  ]
}
```

### Multiple Images

You can add up to 2 images per quiz (recommended). They will be displayed side-by-side on desktop and stacked on mobile:

```json
{
  "images": [
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Pope_Leo_XIV_3_%283x4_cropped%29.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Example_image.jpg/800px-Example_image.jpg"
  ]
}
```

### Finding Wikimedia Commons Images

1. Go to [Wikimedia Commons](https://commons.wikimedia.org/)
2. Search for the image you want
3. Click on the image
4. Right-click and select "Copy image address" or use the direct link
5. Copy the full URL (should start with `https://upload.wikimedia.org/`)

### Features

- ✅ Automatic responsive layout (2 columns on desktop, stacked on mobile)
- ✅ Lazy loading for better performance
- ✅ Hover effects for better UX
- ✅ Supports 1 or 2 images per quiz
- ✅ Works with dark mode

### Notes

- Images are optional - quizzes without the `images` field will display normally
- Use direct image URLs from Wikimedia Commons
- Images are loaded lazily (only when visible) for better performance
- Single images are centered and max-width 500px
- Multiple images are displayed side-by-side (desktop) or stacked (mobile)

