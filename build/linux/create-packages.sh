#!/bin/bash
set -e

# Linux packaging script for NetMerge GUI
# Creates AppImage, .deb, and .rpm packages

VERSION="${1:-0.1.0}"
ARCH="${2:-$(uname -m)}"
BUILD_DIR="build/linux"
OUTPUT_DIR="dist/linux"

# Convert arch to Debian/RPM format
case "$ARCH" in
    x86_64) DEB_ARCH="amd64"; RPM_ARCH="x86_64"; APPIMAGE_ARCH="x86_64" ;;
    aarch64) DEB_ARCH="arm64"; RPM_ARCH="aarch64"; APPIMAGE_ARCH="aarch64" ;;
    armv7l) DEB_ARCH="armhf"; RPM_ARCH="armv7hl"; APPIMAGE_ARCH="armhf" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

echo "Building for $ARCH (DEB: $DEB_ARCH, RPM: $RPM_ARCH, AppImage: $APPIMAGE_ARCH)"

# Clean and create directories
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{DEBIAN,usr/bin,usr/share/applications,usr/share/icons/hicolor/256x256/apps,usr/share/doc/netmerge-gui}
mkdir -p "$OUTPUT_DIR"

# Copy binary
cp ../bin/netmerge-gui "$BUILD_DIR/usr/bin/netmerge-gui"
chmod 755 "$BUILD_DIR/usr/bin/netmerge-gui"

# Copy icon
cp ../frontend/public/icon.svg "$BUILD_DIR/usr/share/icons/hicolor/256x256/apps/netmerge-gui.svg"

# Create .desktop file
cat > "$BUILD_DIR/usr/share/applications/netmerge-gui.desktop" << EOF
[Desktop Entry]
Name=NetMerge GUI
Comment=Use all your internet connections at once
Exec=netmerge-gui
Icon=netmerge-gui
Terminal=false
Type=Application
Categories=Network;Utility;
StartupNotify=true
Categories=Network;Utility;
Keywords=network;proxy;load-balancing;bandwidth;
StartupWMClass=netmerge-gui
EOF

# Create DEBIAN/control
cat > "$BUILD_DIR/DEBIAN/control" << EOF
Package: netmerge-gui
Version: $VERSION
Architecture: $DEB_ARCH
Maintainer: NetMerge Team <team@netmerge.org>
Description: Use all your internet connections at once
 NetMerge GUI is a graphical interface for net-merge, a tool that combines
 multiple internet connections (Wi-Fi, Ethernet, USB tether) into a single
 faster connection using per-connection load balancing.
 .
 Features:
  * Real-time network monitoring
  * Per-adapter speed limits
  * IPv6 policy control
  * System tray integration
  * Cross-platform support
Homepage: https://github.com/net-merge/netmerge-gui
License: MIT
Section: net
Priority: optional
Depends: libc6, libglib2.0-0, libgtk-3-0, libwebkit2gtk-4.1-0
EOF

# Create postinst script
cat > "$BUILD_DIR/DEBIAN/postinst" << 'EOF'
#!/bin/bash
set -e
update-desktop-database
gtk-update-icon-cache -f /usr/share/icons/hicolor 2>/dev/null || true
EOF
chmod 755 "$BUILD_DIR/DEBIAN/postinst"

# Create prerm script
cat > "$BUILD_DIR/DEBIAN/prerm" << 'EOF'
#!/bin/bash
set -e
update-desktop-database
gtk-update-icon-cache -f /usr/share/icons/hicolor 2>/dev/null || true
EOF
chmod 755 "$BUILD_DIR/DEBIAN/prerm"

# Build .deb package
dpkg-deb --build "$BUILD_DIR" "$OUTPUT_DIR/netmerge-gui_${VERSION}_${DEB_ARCH}.deb"
echo "Created: $OUTPUT_DIR/netmerge-gui_${VERSION}_${DEB_ARCH}.deb"

# Create RPM package
RPM_BUILD_DIR="$BUILD_DIR/rpmbuild"
mkdir -p "$RPM_BUILD_DIR"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
mkdir -p "$RPM_BUILD_DIR/usr/bin"
mkdir -p "$RPM_BUILD_DIR/usr/share/applications"
mkdir -p "$RPM_BUILD_DIR/usr/share/icons/hicolor/256x256/apps"

cp ../bin/netmerge-gui "$RPM_BUILD_DIR/usr/bin/netmerge-gui"
cp ../frontend/public/icon.svg "$RPM_BUILD_DIR/usr/share/icons/hicolor/256x256/apps/netmerge-gui.svg"
cp "$BUILD_DIR/usr/share/applications/netmerge-gui.desktop" "$RPM_BUILD_DIR/usr/share/applications/netmerge-gui.desktop"

# Create spec file
cat > "$RPM_BUILD_DIR/SPECS/netmerge-gui.spec" << EOF
Name: netmerge-gui
Version: ${VERSION#v}
Release: 1%{?dist}
Summary: Use all your internet connections at once

License: MIT
URL: https://github.com/net-merge/netmerge-gui
Source0: %{name}-%{version}.tar.gz

BuildRequires: desktop-file-utils, gtk-update-icon-cache
Requires: libc, glib2, gtk3, webkit2gtk4.1

%description
NetMerge GUI is a graphical interface for net-merge, a tool that combines
multiple internet connections (Wi-Fi, Ethernet, USB tether) into a single
faster connection using per-connection load balancing.

%prep
%autosetup -n %{name}-%{version}

%build
# Binary is pre-built

%install
mkdir -p %{buildroot}/usr/bin
mkdir -p %{buildroot}/usr/share/applications
mkdir -p %{buildroot}/usr/share/icons/hicolor/256x256/apps

install -m 755 netmerge-gui %{buildroot}/usr/bin/netmerge-gui
install -m 644 netmerge-gui.desktop %{buildroot}/usr/share/applications/
install -m 644 netmerge-gui.svg %{buildroot}/usr/share/icons/hicolor/256x256/apps/

%post
update-desktop-database &> /dev/null || :
gtk-update-icon-cache -f /usr/share/icons/hicolor &> /dev/null || :

%postun
update-desktop-database &> /dev/null || :
gtk-update-icon-cache -f /usr/share/icons/hicolor &> /dev/null || :

%files
/usr/bin/netmerge-gui
/usr/share/applications/netmerge-gui.desktop
/usr/share/icons/hicolor/256x256/apps/netmerge-gui.svg

%changelog
* $(date +"%a %b %d %Y") NetMerge Team <team@netmerge.org> - ${VERSION#v}-1
- Initial release
EOF

# Build RPM
cd "$RPM_BUILD_DIR"
rpmbuild --define "_topdir $(pwd)" -bb SPECS/netmerge-gui.spec
cp RPMS/$RPM_ARCH/*.rpm "../../$OUTPUT_DIR/"
echo "Created: $OUTPUT_DIR/netmerge-gui-${VERSION#v}-1.${RPM_ARCH}.rpm"

# Create AppImage
cd ..
APPIMAGE_DIR="$BUILD_DIR/appimage"
mkdir -p "$APPIMAGE_DIR/usr/bin"
mkdir -p "$APPIMAGE_DIR/usr/share/applications"
mkdir -p "$APPIMAGE_DIR/usr/share/icons/hicolor/256x256/apps"

cp ../bin/netmerge-gui "$APPIMAGE_DIR/usr/bin/netmerge-gui"
cp ../frontend/public/icon.svg "$APPIMAGE_DIR/netmerge-gui.svg"
cp "../frontend/dist/netmerge-gui.desktop" "$APPIMAGE_DIR/usr/share/applications/" 2>/dev/null || cat > "$APPIMAGE_DIR/usr/share/applications/netmerge-gui.desktop" << EOF
[Desktop Entry]
Name=NetMerge GUI
Comment=Use all your internet connections at once
Exec=netmerge-gui
Icon=netmerge-gui
Terminal=false
Type=Application
Categories=Network;Utility;
StartupNotify=true
EOF

cat > "$APPIMAGE_DIR/AppRun" << 'EOF'
#!/bin/bash
SELF=$(readlink -f "$0")
HERE=${SELF%/*}
export PATH="${HERE}/usr/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${LD_LIBRARY_PATH}"
exec "${HERE}/usr/bin/netmerge-gui" "$@"
EOF
chmod +x "$APPIMAGE_DIR/AppRun"

# Download appimagetool if not present
if ! command -v appimagetool &> /dev/null; then
    wget -q "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-${APPIMAGE_ARCH}.AppImage" -O /tmp/appimagetool
    chmod +x /tmp/appimagetool
    APPIMAGETOOL="/tmp/appimagetool"
else
    APPIMAGETOOL="appimagetool"
fi

$APPIMAGETOOL "$APPIMAGE_DIR" "$OUTPUT_DIR/netmerge-gui-${VERSION}-${APPIMAGE_ARCH}.AppImage"
echo "Created: $OUTPUT_DIR/netmerge-gui-${VERSION}-${APPIMAGE_ARCH}.AppImage"

echo "All packages created successfully!"
ls -la "$OUTPUT_DIR"
EOF
chmod +x /root/netmerge-gui/build/linux/create-packages.sh