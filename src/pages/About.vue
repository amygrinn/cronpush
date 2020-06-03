<template>
  <div class="about">
    <div class="d-flex justify-content-center">
      <router-link to="/"><h3>Get started</h3></router-link>
    </div>
    <div class="content d-flex flex-column align-items-center">
      <h1 class="m-4">Cron Push</h1>
      <h3 class="m-4">Push notification scheduler</h3>
    </div>
  </div>
</template>

<style lang="scss">
.about {
  background-color: white;
  height: 100vh;
}

.content {
  overflow-y: scroll;
}

a:hover {
  color: black;
}
</style>
