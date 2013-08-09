End Pool
========

Listen for all transitionend events to fire on a single element or a collection of elements.

_Note:_ This is a work in progress.

## Usage

```css

.mover{
  transition: transform 200ms, opacity 300ms, top 400ms;
}

```


```html

<div id="stuff_that_will_move">
  <div class="mover"></div>
  <div class="mover shaker"></div>
  <div class="mover shaker maker"></div>
</div>

```


```js

  // Create a new instance of EndPool
  var endPool = new EndPool(),
      movers = document.querySelectorAll('.mover'),
      shaker = document.querySelector('.shaker');

  //
  // Listen for just '.shaker' to finish all its transitions
  //
  // NOTE: We pass in 3 as the second argument since we need to listen for
  //      3 separate transitions to end
  //
  endPool.listenForEndOf(shaker, 3, function () {
    // .shaker has finished its 3 transitions
    // NOTE: The callback is executed in the context of the element itself
    //      so you can do something like: 
    //          this.innerHTML = 'done!';
    //      (although I don't know why you would)
  });

  // Listen for all transitions to finish on all items
  end.listenForEndOfAll(movers, 3, function () {
    // Every .mover has finished!
  });

```
