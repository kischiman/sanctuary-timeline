# Deployment Guide

## Fly.io Deployment with Persistent Database

This app uses SQLite with persistent storage to ensure events survive deployments and restarts.

### Prerequisites

1. Install Fly.io CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Login to Fly.io: `flyctl auth login`

### Initial Deployment

1. **Create the app** (if not already created):
   ```bash
   flyctl apps create sanctuary-timeline
   ```

2. **Create persistent volume** for database storage:
   ```bash
   flyctl volumes create timeline_data --region iad --size 1
   ```

3. **Deploy the app**:
   ```bash
   flyctl deploy
   ```

### Subsequent Deployments

For updates, just run:
```bash
flyctl deploy
```

The database will persist across deployments in the `/data` directory.

### Database Location

- **Production**: `/data/timeline.db` (persistent volume)
- **Development**: `./timeline.db` (local file)

### Accessing Your App

After successful deployment:
- App URL: `https://sanctuary-timeline.fly.dev`
- Admin Panel: `https://sanctuary-timeline.fly.dev/admin`

### Managing the Volume

- **List volumes**: `flyctl volumes list`
- **Destroy volume**: `flyctl volumes destroy <volume_id>` (⚠️ This will delete all data)
- **Volume info**: `flyctl volumes show <volume_id>`

### Troubleshooting

If deployment fails:
1. Check logs: `flyctl logs`
2. Verify volume exists: `flyctl volumes list`
3. Ensure app and volume are in same region