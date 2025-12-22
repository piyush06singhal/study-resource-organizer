# Storage Setup Instructions

To enable file uploads for PDFs and images, you need to create a storage bucket in Supabase.

## Manual Setup (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Enter the following details:
   - **Name**: `study-resources`
   - **Public bucket**: ✅ Enable (checked)
5. Click **Create bucket**

## Set Up Policies

After creating the bucket, set up the following policies:

1. Go to the **Policies** tab for the `study-resources` bucket
2. Add the following policies:

### Policy 1: Users can upload their own files
- **Policy name**: Users can upload their own files
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **USING expression**: 
```sql
bucket_id = 'study-resources' AND (storage.foldername(name))[1] = auth.uid()::text
```

### Policy 2: Users can view their own files
- **Policy name**: Users can view their own files
- **Allowed operation**: SELECT
- **Target roles**: authenticated
- **USING expression**: 
```sql
bucket_id = 'study-resources' AND (storage.foldername(name))[1] = auth.uid()::text
```

### Policy 3: Users can delete their own files
- **Policy name**: Users can delete their own files
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **USING expression**: 
```sql
bucket_id = 'study-resources' AND (storage.foldername(name))[1] = auth.uid()::text
```

### Policy 4: Public can view files
- **Policy name**: Public can view files
- **Allowed operation**: SELECT
- **Target roles**: public
- **USING expression**: 
```sql
bucket_id = 'study-resources'
```

## Alternative: Use URLs

If you don't want to set up storage, you can use direct URLs to files hosted elsewhere:
- Upload your PDFs/images to Google Drive, Dropbox, or any file hosting service
- Get the direct/public link
- Use that URL when creating resources

The app supports both file uploads and URL-based resources.
