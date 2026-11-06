package main

import (
	"context"
	"embed"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"netmerge-gui/internal/core"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:             "NetMerge GUI",
		Width:             1200,
		Height:            800,
		MinWidth:          900,
		MinHeight:         600,
		DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: true,
		BackgroundColour: &options.RGBA{R: 24, G: 24, B: 27, A: 255},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Logger: logger.NewDefaultLogger(logger.INFO),
		Bind: []interface{}{
			NewApp(),
		},
		Menu: nil,
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
		},
		OnShutdown: func(ctx context.Context) {
			app.shutdown(ctx)
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:  "",
			WebviewBrowserPath:   "",
			Theme:                windows.SystemDefault,
			CustomInvocationIcon: "",
			DisablePinchZoom:     true,
		},
		Mac: &mac.Options{
			TitleBar:             mac.TitleBarDefault(),
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			TitleBarHidden:       false,
			TitleBarHideOnBlur:   false,
			FullSizeContent:      false,
			About: &mac.AboutInfo{
				Title:   "NetMerge GUI",
				Version: "0.1.0",
			},
		},
		Linux: &linux.Options{
			Icon:                nil,
			ProgramName:         "netmerge-gui",
			WebviewGpuPolicy:    linux.WebviewGpuPolicyAlways,
			WindowIsTranslucent: false,
			WebviewIsTransparent: false,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

type App struct {
	ctx       context.Context
	core      *core.NetMergeCore
	started   bool
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.core = core.NewNetMergeCore(ctx)

	// Start the core
	if err := a.core.Start(); err != nil {
		runtime.LogError(a.ctx, "Failed to start core: "+err.Error())
	}

	a.started = true

	// Setup system tray
	setupTray(ctx)

	// Emit initial config
	runtime.EventsEmit(ctx, "config:load", map[string]interface{}{
		"scheduler_mode": "weighted",
		"ipv6_policy":    "auto",
		"mtu":            9000,
		"socks5_enabled": false,
		"theme":          "auto",
		"auto_start":     false,
		"auto_pause":     true,
	})
}

func (a *App) shutdown(ctx context.Context) {
	if a.core != nil {
		a.core.Stop()
	}
}

func (a *App) GetConfig() map[string]interface{} {
	return map[string]interface{}{
		"scheduler_mode": "weighted",
		"ipv6_policy":    "auto",
		"mtu":            9000,
		"socks5_enabled": false,
		"theme":          "auto",
		"auto_start":     false,
		"auto_pause":     true,
	}
}

func (a *App) GetAdapters() []map[string]interface{} {
	if a.core == nil {
		return []map[string]interface{}{}
	}
	return a.core.GetAdapters()
}

func (a *App) UpdateAdapterConfig(name string, config map[string]interface{}) error {
	if a.core == nil {
		return nil
	}
	return a.core.UpdateAdapterConfig(name, config)
}

func (a *App) TogglePause() error {
	if a.core == nil {
		return nil
	}
	// In a real implementation, this would toggle the core
	return nil
}

func (a *App) GetStatus() map[string]interface{} {
	if a.core == nil {
		return map[string]interface{}{"running": false}
	}
	return a.core.GetStatus()
}

func (a *App) GetHistory(hours int) ([]map[string]interface{}, error) {
	// Mock history data
	data := make([]map[string]interface{}, 24)
	for i := 0; i < 24; i++ {
		data[i] = map[string]interface{}{
			"time":         100 + i*3600,
			"download":     1024*1024*10 + i*1024*1024,
			"upload":       1024*1024*2 + i*1024*512,
			"wifi_latency":  12 + float64(i%5)*2,
			"ethernet_latency": 3 + float64(i%3)*1,
			"tether_latency": 25 + float64(i%4)*3,
		}
	}
	return data, nil
}

func (a *App) SetAdapterConfig(config map[string]interface{}) error {
	if a.core == nil {
		return nil
	}
	name, ok := config["name"].(string)
	if !ok {
		return nil
	}
	return a.core.UpdateAdapterConfig(name, config)
}

func (a *App) SetSchedulerMode(mode string) error {
	if a.core == nil {
		return nil
	}
	return a.core.SetSchedulerMode(mode)
}

func (a *App) SetIPv6Policy(policy string) error {
	if a.core == nil {
		return nil
	}
	return a.core.SetIPv6Policy(policy)
}

func (a *App) SetMTU(mtu int) error {
	if a.core == nil {
		return nil
	}
	return a.core.SetMTU(mtu)
}

func (a *App) SetSpeedLimit(adapter string, limit int64) error {
	if a.core == nil {
		return nil
	}
	return a.core.SetSpeedLimit(adapter, limit)
}

func (a *App) Quit() {
	runtime.Quit(a.ctx)
}

func (a *App) Show() {
	runtime.WindowShow(a.ctx)
}

func (a *App) Hide() {
	runtime.WindowHide(a.ctx)
}

func (a *App) Minimize() {
	runtime.WindowMinimise(a.ctx)
}

func setupTray(ctx context.Context) {
	appMenu := menu.NewMenu()

	fileMenu := appMenu.AddSubmenu("File")
	fileMenu.AddText("Show Dashboard", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		runtime.WindowShow(ctx)
	})
	fileMenu.AddSeparator()
	fileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		runtime.Quit(ctx)
	})

	editMenu := appMenu.AddSubmenu("Edit")
	editMenu.AddText("Copy", keys.CmdOrCtrl("c"), func(_ *menu.CallbackData) {})
	editMenu.AddText("Paste", keys.CmdOrCtrl("v"), func(_ *menu.CallbackData) {})

	viewMenu := appMenu.AddSubmenu("View")
	viewMenu.AddText("Reload", keys.CmdOrCtrl("r"), func(_ *menu.CallbackData) {
		runtime.WindowReload(ctx)
	})
	viewMenu.AddText("Toggle DevTools", keys.CmdOrCtrl("i"), func(_ *menu.CallbackData) {
		runtime.WindowToggleDevTools(ctx)
	})

	helpMenu := appMenu.AddSubmenu("Help")
	helpMenu.AddText("About", keys.CmdOrCtrl("a"), func(_ *menu.CallbackData) {
		runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "About NetMerge GUI",
			Message: "NetMerge GUI v0.1.0\nUse all your internet connections at once.\n\nhttps://github.com/net-merge/netmerge-gui",
		})
	})

	runtime.MenuSetAppMenu(ctx, appMenu)

	// System tray
	trayMenu := menu.NewMenu()
	trayMenu.AddText("Show Dashboard", nil, func(_ *menu.CallbackData) {
		runtime.WindowShow(ctx)
	})
	trayMenu.AddSeparator()
	trayMenu.AddText("Pause Balancing", nil, func(_ *menu.CallbackData) {
		runtime.EventsEmit(ctx, "tray:toggle_pause", nil)
	})
	trayMenu.AddSeparator()
	trayMenu.AddText("Quit", nil, func(_ *menu.CallbackData) {
		runtime.Quit(ctx)
	})
	runtime.SystemTraySetMenu(ctx, trayMenu)
}