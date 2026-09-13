# PyInstaller spec file. Build with:
#   pyinstaller hossa.spec
# Output lands in dist/HOSSA/ - HOSSA.exe plus everything it needs
# alongside it. That whole folder is what gets distributed/zipped, not
# just the .exe by itself.
#
# Before building: `cd frontend && npm run build && cd ..` - this bundles
# whatever's currently in frontend/dist/ into the executable, so rebuild
# the frontend first if you've changed it since the last build.
#
# NOTE: this is a best-effort starting point, not a guaranteed-working
# spec. FastAPI/uvicorn/bcrypt bundle a lot of dynamic imports and C
# extensions that PyInstaller's static analysis can miss - if the built
# .exe fails at runtime with a `ModuleNotFoundError` for something not
# listed in hiddenimports below, that's the fix: add it here and rebuild.

block_cipher = None

a = Analysis(
    ['backend/launcher.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        ('frontend/dist', 'frontend/dist'),
        ('db/schema_sqlite.sql', 'db'),
    ],
    hiddenimports=[
        # uvicorn's protocol/loop auto-selection uses dynamic imports that
        # PyInstaller's static analysis doesn't always catch.
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        # SQLAlchemy's SQLite dialect.
        'sqlalchemy.dialects.sqlite',
        # bcrypt's compiled backend.
        'bcrypt',
        '_cffi_backend',
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='HOSSA',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,   # TEMP: debugging - set back to False once launcher.py works reliably
    disable_windowed_traceback=False,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    name='HOSSA',
)
