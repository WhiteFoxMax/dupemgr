# Electron Duplicate Manager & File Organizer

**TL;DR:** Build a Windows Electron app with TypeScript/React UI that performs file hash (MD5/SHA256) duplicate detection, then allows users to manage duplicates and organize files by media capture dates. Two-step workflow: (1) scan & identify duplicates by comparing file hashes, (2) user selects action (delete, keep, organize), and (3) organize kept files into date-based folders with EXIF metadata extraction. This modular architecture separates file scanning, hash computation, metadata extraction, and file operations into independent services.

## Technology Stack Decisions

- **Framework**: Electron + TypeScript + React
- **Duplicate Detection**: File hash comparison (MD5/SHA256) - exact match detection
- **Date Source**: Media EXIF/metadata extraction
- **Workflow**: Two-step with user control (1) identify duplicates, (2) user selects actions
- **UI Theme**: Dark mode (modern, professional aesthetic, easy on the eyes)

## Implementation Steps

### 1. Initialize Electron + TypeScript Project Structure
- Create base Electron app with main process (`src/main`) and renderer process (`src/renderer`)
- Set up React + TypeScript for UI components in renderer
- Configure IPC communication between processes
- Set up webpack/Vite build pipeline for development and production

### 2. Build Core Backend Services
- **File Scanner Service** (`src/services/fileScanner.ts`)
  - Recursive directory traversal
  - Filter for media types (jpg, png, mp4, mov, etc.)
  - Report progress via IPC events
  
- **File Hash Service** (`src/services/hashDetection.ts`)
  - Compute MD5 or SHA256 hash for each file
  - Compare hashes to find exact duplicates
  - Group files by identical hash values
  - Return duplicate groups (100% match confidence)
  
- **EXIF Metadata Extractor** (`src/services/metadataExtractor.ts`)
  - Extract creation dates from images using `exifparser`
  - Extract video metadata using `fluent-ffprobe`
  - Fallback to file system dates if metadata unavailable
  
- **File Organizer Service** (`src/services/fileOrganizer.ts`)
  - Create date-based folder structure (e.g., `2024-02-16`, `2024-02`)
  - Safely move files with conflict resolution
  - Support undo/rollback operations

### 3. Create IPC Communication Layer
- Set up async IPC handlers for long-running tasks (scanning, similarity detection)
- Implement progress events for UI updates during scans
- Error handling and cancellation support
- Type-safe IPC channels

### 4. Build React UI Components (Dark Mode Theme)
- **Landing Page**
  - Folder selection with drag-drop or browse dialog
  - Recent folders list
  - Dark background (#1e1e1e), accent colors for buttons
  
- **Scan Results View**
  - Display duplicate groups with thumbnails
  - Show hash match percentages
  - File count and storage savings estimation
  - Dark cards with subtle borders for duplicate groups
  
- **Action Selection Panel**
  - Let users choose per duplicate: keep/delete/ignore
  - Auto-keep newest by date option
  - Batch operations for efficiency
  - Dark themed checkboxes and selection controls
  
- **Organization Preview**
  - Show proposed date-based folder structure
  - Preview of how files will be organized
  - Confirmation before committing changes
  - Dark tree view with highlighted changes
  
- **Progress Indicators**
  - Scanning progress with file count
  - Logging panel for debugging
  - Estimated time remaining
  - Dark progress bars with color-coded status

**Dark Mode Color Scheme:**
- Background: #1e1e1e (main), #2d2d2d (secondary)
- Text: #e0e0e0 (primary), #a0a0a0 (secondary)
- Accents: #0078d4 (primary blue), #50e6e6 (cyan highlights)
- Status colors: #4ec9b0 (success), #ce9178 (warning), #f48771 (error)

### 5. Implement Two-Step Workflow Logic

**Step 1: Scan Phase**
- Recursively scan selected directory
- Generate perceptual hashes for images and videos
- Group potential duplicates by similarity threshold
- Display results in UI

**Step 2: User Actions Phase**
- User reviews duplicate groups
- Selects which files to keep/delete for each group
- Configures organization preferences (date grouping granularity, etc.)
- Preview changes

**Step 3: Execute Phase**
- Delete marked files (with optional backup)
- Organize remaining files into date-based folder structure
- Report results and changes made

### 6. Add Safety Features
- **Undo/Recover**: Optional backup before deletion for recovery
- **Dry-Run Mode**: Preview changes without executing
- **File Lock Detection**: Skip files currently in use
- **Detailed Change Log**: User review of all modifications
- **Conflict Resolution**: Handle naming conflicts during organization

### 7. Package and Distribution
- Build standalone Windows executable using `electron-builder`
- Create installer with optional Windows registry associations
- Auto-update capability (optional)

## Data Structures

### Duplicate Group
```typescript
interface DuplicateGroup {
  id: string;
  files: {
    path: string;
    size: number;
    hash: string;
    thumbnail?: string;
    metadata: FileMetadata;
  }[];
  similarityScore: number;
  potentialSavings: number;
}
```

### File Metadata
```typescript
interface FileMetadata {
  path: string;
  createdDate: Date;
  modifiedDate: Date;
  mediaDate?: Date;  // From EXIF/metadata
  type: 'image' | 'video';
  size: number;
}
```

## Workflow Diagram

```
┌─────────────────┐
│ User selects    │
│ folder to scan  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ STEP 1: Scan & Identify Duplicates  │
├─────────────────────────────────────┤
│ - Recursive directory scan          │
│ - Compute MD5/SHA256 hash per file  │
│ - Group files with identical hashes │
│ - Extract metadata                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Display duplicate groups to user    │
│ Show exact matches & savings        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ STEP 2: User Actions & Preview      │
├─────────────────────────────────────┤
│ User decides for each group:        │
│ - Which file to keep                │
│ - Delete other copies               │
│ - Strategy for organization         │
│ Review proposed folder structure    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ STEP 3: Execute Changes             │
├─────────────────────────────────────┤
│ - Delete marked duplicates          │
│ - Create date-based folder tree     │
│ - Move organized files              │
│ - Report results                    │
└─────────────────────────────────────┘
```

## Testing Strategy

- **Unit Tests**: File scanner, similarity detection, metadata extraction
- **Integration Tests**: End-to-end scanning and organization workflow
- **Manual Testing**: 
  - Create test directory with duplicate images (resize, compress variations)
  - Verify visual similarity detection catches modified duplicates
  - Test EXIF extraction with various camera formats and video files
  - Verify date-based folder organization works correctly
  - UI responsiveness during large directory scans (1000+ files)
  - File safety: confirm backups/undo work before deployment

## Performance Considerations

- Parallelize hash computation for multiple images
- Implement caching for computed hashes (store in metadata DB)
- Lazy load thumbnails in UI
- Use worker threads for CPU-intensive operations
- Stream file operations for large file handling
- Limit concurrent file operations to prevent system bottlenecks

## Dependencies to Install

- `electron` - Desktop app framework
- `electron-builder` - Packaging and distribution
- `react` - UI framework
- `typescript` - Type safety
- `crypto` (Node.js built-in) - MD5/SHA256 hashing
- `exifparser` - EXIF data extraction
- `fluent-ffprobe` - FFmpeg wrapper for video metadata
- `electron-store` - Persistent storage for app state
- `uuid` - Unique ID generation
- `fast-folder-size` - Efficient file size calculation (optional)

## Security Notes

- Validate all file paths to prevent directory traversal attacks
- Run file operations with appropriate user permissions
- Implement confirmations for destructive operations
- Log all file deletions for audit trail
- Consider sandboxing for file system access

## Future Enhancements

- Cloud backup integration before deletion
- Advanced filtering (file type, size, date range)
- Compression suggestions for near-duplicates
- Multi-threading for faster scanning on large directories
- Custom organization templates (not just by date)
- Export/import organization plans
- Scheduled automatic scanning
