export class ScrollManager {
  // private frozenScrollPosition: { x: number; y: number };
  // private isScrollFrozen: boolean;
  // private scrollFreezeHandler: ((e?: any) => void) | null;

  // constructor() {
  //   this.frozenScrollPosition = { x: 0, y: 0 };
  //   this.isScrollFrozen = false;
  //   this.scrollFreezeHandler = null;
  // }

  public freezeScroll(): void {
    document.body.classList.add("overflow");
    // if (this.isScrollFrozen) return;

    // // console.log('❄️ Freezing scroll at current position');
    // this.isScrollFrozen = true;

    // // Сохраняем текущую позицию
    // this.frozenScrollPosition = {
    //   x: window.pageXOffset || document.documentElement.scrollLeft || 0,
    //   y: window.pageYOffset || document.documentElement.scrollTop || 0,
    // };

    // // console.log('📍 Frozen at position:', this.frozenScrollPosition);

    // // Счетчик для предотвращения слишком частых вызовов scrollTo
    // let lastScrollTime = 0;
    // const SCROLL_THROTTLE = 16; // ~60fps

    // // Создаем обработчик, который будет возвращать скролл на место
    // this.scrollFreezeHandler = () => {
    //   if (!this.isScrollFrozen) return;

    //   const now = Date.now();
    //   if (now - lastScrollTime < SCROLL_THROTTLE) {
    //     return; // Пропускаем слишком частые вызовы
    //   }
    //   lastScrollTime = now;

    //   const currentX =
    //     window.pageXOffset || document.documentElement.scrollLeft || 0;
    //   const currentY =
    //     window.pageYOffset || document.documentElement.scrollTop || 0;

    //   // Если позиция изменилась, возвращаем на место
    //   if (
    //     currentX !== this.frozenScrollPosition.x ||
    //     currentY !== this.frozenScrollPosition.y
    //   ) {
    //     // Используем requestAnimationFrame для плавности
    //     requestAnimationFrame(() => {
    //       if (this.isScrollFrozen) {
    //         // Дополнительная проверка
    //         window.scrollTo(
    //           this.frozenScrollPosition.x,
    //           this.frozenScrollPosition.y,
    //         );
    //       }
    //     });
    //   }
    // };

    // // Добавляем обработчик на событие скролла
    // window.addEventListener("scroll", this.scrollFreezeHandler, {
    //   passive: true,
    // });

    // // Для мобильных устройств также отслеживаем touchmove
    // const touchHandler = () => {
    //   if (!this.isScrollFrozen) return;

    //   // Проверяем позицию после тач события с задержкой
    //   requestAnimationFrame(() => {
    //     if (this.scrollFreezeHandler && this.isScrollFrozen) {
    //       this.scrollFreezeHandler();
    //     }
    //   });
    // };

    // document.addEventListener("touchend", touchHandler, { passive: true });
    // document.addEventListener("touchcancel", touchHandler, { passive: true });

    // // Сохраняем ссылку на touchHandler для удаления
    // (this.scrollFreezeHandler as any).touchHandler = touchHandler;
  }

  public unfreezeScroll(): void {
    document.body.classList.remove("overflow");
    // if (!this.isScrollFrozen) return;

    // // console.log('🔥 Unfreezing scroll');
    // this.isScrollFrozen = false;

    // // Убираем обработчик скролла
    // if (this.scrollFreezeHandler) {
    //   window.removeEventListener("scroll", this.scrollFreezeHandler);

    //   // Убираем touch обработчик если есть
    //   if ((this.scrollFreezeHandler as any).touchHandler) {
    //     document.removeEventListener(
    //       "touchend",
    //       (this.scrollFreezeHandler as any).touchHandler,
    //     );
    //     document.removeEventListener(
    //       "touchcancel",
    //       (this.scrollFreezeHandler as any).touchHandler,
    //     );
    //   }

    //   this.scrollFreezeHandler = null;
    // }

    // // КРИТИЧНО: Принудительно устанавливаем позицию ПЕРЕД разморозкой
    // // Это предотвращает "улетание" от накопленных событий
    // window.scrollTo(this.frozenScrollPosition.x, this.frozenScrollPosition.y);

    // // Дополнительная защита: устанавливаем временный обработчик
    // // который будет блокировать слишком резкие изменения позиции
    // let preventExtremeMoves = true;
    // const safeUnfreezeHandler = () => {
    //   if (!preventExtremeMoves) return;

    //   const currentX =
    //     window.pageXOffset || document.documentElement.scrollLeft || 0;
    //   const currentY =
    //     window.pageYOffset || document.documentElement.scrollTop || 0;

    //   // Если позиция изменилась больше чем на 200px от замороженной, возвращаем обратно
    //   const deltaX = Math.abs(currentX - this.frozenScrollPosition.x);
    //   const deltaY = Math.abs(currentY - this.frozenScrollPosition.y);

    //   if (deltaX > 200 || deltaY > 200) {
    //     // console.log('🚫 Preventing extreme scroll jump:', { deltaX, deltaY });
    //     window.scrollTo(
    //       this.frozenScrollPosition.x,
    //       this.frozenScrollPosition.y,
    //     );
    //   }
    // };

    // // Временно защищаем от экстремальных прыжков
    // window.addEventListener("scroll", safeUnfreezeHandler, { passive: true });

    // // Убираем защиту через короткое время
    // setTimeout(() => {
    //   preventExtremeMoves = false;
    //   window.removeEventListener("scroll", safeUnfreezeHandler);
    //   // console.log('✅ Scroll fully unfrozen');
    // }, 100); // 100ms защиты от накопленных событий

    // // console.log('✅ Scroll unfrozen with protection');
  }
}

const scrollManager = new ScrollManager();

export default scrollManager;
