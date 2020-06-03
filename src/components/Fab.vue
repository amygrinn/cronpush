<template>
  <i class="fab material-icons position-fixed m-4 p-1">
    add
  </i>
</template>

<style lang="scss">
@import 'variables';

.fab {
  bottom: 0;
  right: 0;
  background-color: $secondary;
  border-radius: 50%;
  padding: 8;
  cursor: pointer;
  font-size: 32px;
}

.fab:hover {
  transition: box-shadow 0.5s;
  box-shadow: 0 0 12px 4px rgba(255, 255, 255, 0.3);
  animation: wiggle 2s infinite;
}

.fab:not(:hover) {
  animation: focus 5s infinite;
}

@keyframes focus {
  0% {
    box-shadow: 0 0 20px 12px rgba(255, 255, 255, 0.1);
  }
  20% {
    box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.3);
    transform: rotate(-10deg) translateY(-4px);
  }
  40% {
    box-shadow: 0 0 20px 12px rgba(255, 255, 255, 0.1);
    transform: rotate(0deg);
  }
}

@keyframes wiggle {
  $wiggle: 10deg;
  $tick: 5;
  $i: 1;

  0% {
    transform: rotate(0) translateY(-4px);
  }

  @while $i < 40 {
    $i: $i + 2 * $tick;

    #{$i}% {
      transform: rotate($wiggle) translateY(-4px);
    }

    #{$i + $tick}% {
      transform: rotate(-$wiggle) translateY(-4px);
    }
  }

  #{$i + 2 * $tick}% {
    transform: rotate(0) translateY(-4px);
  }

  100% {
    transform: rotate(0) translateY(-4px);
  }
}
</style>
