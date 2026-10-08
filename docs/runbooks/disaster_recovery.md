# Disaster Recovery & Operational Runbook

## 1. Automated Backups & Restoration

### 1.1 Snapshot Creation
Database snapshots are triggered via the enterprise script:
```bash
python scripts/backup_db.py
```
This stores timestamped SQL or SQLite files into the `backups/` directory.

### 1.2 PostgreSQL Disaster Restoration
To restore a database dump into PostgreSQL:
```bash
# 1. Stop web workers
docker compose stop backend

# 2. Drop existing connections and restore
docker compose exec postgres psql -U finkison -c "DROP DATABASE finkison_db;"
docker compose exec postgres psql -U finkison -c "CREATE DATABASE finkison_db;"
cat backups/db_postgres_dump_YYYYMMDD_HHMMSS.sql | docker compose exec -T postgres psql -U finkison -d finkison_db

# 3. Start web workers
docker compose start backend
```

---

## 2. Zero-Downtime Rolling Deployments

1. Build new container versions without interrupting running instances:
   ```bash
   docker compose build backend frontend
   ```
2. Apply schema migrations safely:
   ```bash
   docker compose run --rm backend python manage.py migrate --noinput
   ```
3. Restart web containers with healthcheck confirmation:
   ```bash
   docker compose up -d --no-deps backend frontend
   ```

---

## 3. Secret & API Key Rotation

If credentials (such as `CHAPA_SECRET_KEY` or `GEMINI_API_KEY`) need to be rotated:
1. Update `Backend/.env` with the new keys.
2. In Docker production:
   ```bash
   docker compose up -d --force-recreate backend
   ```
3. Run the synthetic health monitor to verify all endpoints respond:
   ```bash
   python scripts/health_check.py
   ```
