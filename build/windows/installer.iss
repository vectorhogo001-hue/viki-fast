; NetMerge GUI - NSIS Installer Script
!include "LogicLib.nsh"
!include "x64.nsh"

!define PRODUCT_NAME "NetMerge GUI"
!define PRODUCT_VERSION "0.1.0"
!define PRODUCT_PUBLISHER "NetMerge Team"
!define PRODUCT_WEB_SITE "https://github.com/net-merge/netmerge-gui"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\netmerge-gui.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\NetMerge GUI"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "netmerge-gui-setup.exe"
InstallIcon "icon.ico"
UninstallIcon "icon.ico"
LicenseText "LICENSE"
LicenseData "LICENSE"

Page directory
Page instfiles

UninstallPage uninstConfirm
UninstallPage uninstFinish

Section "Main Program" SecMain
  SetOutPath "$INSTDIR"
  File /r "dist\*"
  File "netmerge-gui.exe"

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"

  ; Create Start Menu shortcuts
  CreateDirectory "$SMPROGRAMS\NetMerge GUI"
  CreateShortcut "$SMPROGRAMS\NetMerge GUI\NetMerge GUI.lnk" "$INSTDIR\netmerge-gui.exe"
  CreateShortcut "$SMPROGRAMS\NetMerge GUI\Uninstall.lnk" "$INSTDIR\uninstall.exe"

  ; Write registry keys
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\netmerge-gui.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
SectionEnd

Section "Start at Login" SecAutoStart
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "NetMerge GUI" '"$INSTDIR\netmerge-gui.exe" tray'
SectionEnd

Section "Desktop Shortcut" SecDesktop
  CreateShortcut "$DESKTOP\NetMerge GUI.lnk" "$INSTDIR\netmerge-gui.exe"
SectionEnd

; Uninstaller
Section Uninstall
  Delete "$INSTDIR\*"
  RMDir /r "$INSTDIR"
  Delete "$SMPROGRAMS\NetMerge GUI\*.*"
  RMDir "$SMPROGRAMS\NetMerge GUI"
  Delete "$DESKTOP\NetMerge GUI.lnk"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  DeleteRegKey HKLM "${PRODUCT_UNINST_KEY}"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "NetMerge GUI"
SectionEnd