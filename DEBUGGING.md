# Debugging Admin Console to Frontend Connection

## Current Status
- ✅ Admin console loads
- ✅ Frontend component is set up
- ❌ Departments are not being saved to database

## Step-by-Step Debugging

### 1. Verify You're Logged In
Visit: `http://localhost:3000/api/test/admin-session`
- Should show: `"authenticated": true, "isAdmin": true`
- If not, log in at `/login` with `admin@peboli.store`

### 2. Test Manual Save (Bypass Admin Page)
Open browser console (F12) and run:
```javascript
fetch('/api/test/manual-save-department', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ 
    departments: [{ name: 'Toys', slug: 'toys' }] 
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected Result:**
- `success: true`
- `saved.value` should contain the department

**If this works:** The database save works, issue is in the admin page
**If this fails:** Check the error message

### 3. Test Save from Admin Console
1. Go to: `http://localhost:3000/admin/departments`
2. Add a department (Name: "Toys", Slug: "toys")
3. Click "Save Changes"
4. **Check browser console (F12)** for:
   - `[Admin] Attempting to save departments:`
   - `[Admin] Response status:`
   - `[API /api/admin/departments PUT]` logs
   - Any error messages

### 4. Check What Was Saved
Visit: `http://localhost:3000/api/debug/departments`
- Should show: `"found": true` if save worked
- Check `parsed` field for the departments array

### 5. Check Frontend Fetch
Visit: `http://localhost:3000/api/departments`
- Should return an array of departments
- Check browser console on landing page for `[ShopByDepartment]` logs

## Common Issues

### Issue: "Unauthorized" Error
**Solution:** 
- Make sure you're logged in as `admin@peboli.store`
- Check `NEXTAUTH_URL` is set to `http://localhost:3000` in `.env.local`
- Restart dev server after changing `.env.local`

### Issue: Save Succeeds But Data Not Found
**Solution:**
- Check database connection
- Verify Prisma schema has `Setting` model
- Check server logs for Prisma errors

### Issue: Frontend Not Updating
**Solution:**
- Check browser console for `[ShopByDepartment]` logs
- Verify event listeners are working
- Check Network tab to see if `/api/departments` is being called
- Hard refresh the page (Ctrl+Shift+R)

## Quick Test Commands

```bash
# Check connection status
curl http://localhost:3000/api/test/connection-status

# Check if departments exist
curl http://localhost:3000/api/debug/departments

# Check public API
curl http://localhost:3000/api/departments

# Check admin API (requires auth)
curl http://localhost:3000/api/admin/departments
```

