# Scheduled Publication Feature

QuizQuaz supports **scheduled publication** - you can add quiz editions with future dates to `quizzes.json`, and they will automatically become visible when their publication date arrives.

## How It Works

- Only quizzes with dates **<= today** are displayed
- Quizzes with future dates are automatically hidden
- When the date arrives, the quiz automatically becomes visible (no manual intervention needed)
- Perfect for scheduling weekly publications (e.g., every Monday)

## Usage Example

### 1. Generate Future Dates

You can use the helper function `generateWeeklyDates()` in the browser console to generate dates:

```javascript
// Generate dates for every Monday, starting from Jan 6, 2025, for 52 weeks
generateWeeklyDates('2025-01-06', 52, 1)
// Returns: ['2025-01-06', '2025-01-13', '2025-01-20', ...]
```

Or manually create dates:
- Format: `YYYY-MM-DD` (e.g., `2025-01-06`)
- You can schedule quizzes for any future date

### 2. Add Quizzes to quizzes.json

Add quiz editions with future dates to `data/quizzes.json`:

```json
{
  "quizzes": [
    {
      "id": "2025-10-28",
      "date": "2025-10-28",
      "title": "28. oktober 2025",
      "edition": 1,
      "questions": [...]
    },
    {
      "id": "2025-11-04",
      "date": "2025-11-04",
      "title": "4. november 2025",
      "edition": 2,
      "questions": [...]
    },
    {
      "id": "2025-12-23",
      "date": "2025-12-23",
      "title": "23. desember 2025",
      "edition": 3,
      "questions": [...]
    }
  ]
}
```

### 3. Automatic Publication

- Quizzes with dates <= today are immediately visible
- Quizzes with future dates are hidden until their publication date
- No code changes needed - just refresh the page on the publication date

## Benefits

✅ **Front-load content**: Create months of quizzes in advance  
✅ **Automatic publishing**: No manual intervention required  
✅ **Scheduled releases**: Perfect for weekly or monthly publications  
✅ **Timezone-aware**: Uses local date for comparison  

## Example: Weekly Monday Publications

To schedule quizzes for every Monday:

1. Open browser console on your site
2. Run: `generateWeeklyDates('2025-01-06', 52, 1)` (52 weeks = 1 year)
3. Copy the generated dates
4. Add quiz entries to `quizzes.json` with those dates
5. Quizzes will automatically appear each Monday!

## Notes

- Dates are compared at midnight (00:00:00) local time
- The system checks dates on every page load
- Future quizzes are completely hidden (not shown in dropdowns or grids)
- Console will log how many quizzes are published vs scheduled

