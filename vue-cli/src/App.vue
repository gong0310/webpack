<template>
  <h1 class="title">hello app</h1>
  <hr />
  <el-button @click="handelClick" type="primary">哈哈哈</el-button>
  <el-select v-model="value" class="m-2" placeholder="Select" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <ul>
    <li>
      <router-link to="/home">home</router-link>
    </li>
    <li>
      <router-link to="/about">about</router-link>
    </li>
  </ul>
  <router-view />
</template>

<script setup>
import { ref } from "vue";

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
];

const handelClick = () => {
  console.log("====", value.value);
};
</script>

<style>
.title {
  color: pink;
}
</style>
