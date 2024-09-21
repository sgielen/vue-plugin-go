package vue

import (
	"sync"
	"syscall/js"
)

func getVue() js.Value {
	return sync.OnceValue(func() js.Value {
		vue := js.Global().Get("Vue")
		if vue.IsUndefined() {
			panic("attempted to interact with Vue instance from Javascript, but it wasn't set")
		}
		return vue
	})()
}
