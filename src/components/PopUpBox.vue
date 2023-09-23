<script setup>

    const props = defineProps(['show']);

</script>

<template>

    <div v-if="show.on" class="box">

        <div @click="props.show.on=false" class="mask"></div>

        <div class="windowBox">

            <div class="tabBox">
                <slot name="tab"></slot>
                <button @click="props.show.on=false" class="close" title="關閉">╳</button>
            </div>
            
            <hr>

            <slot name="content"></slot>
            
        </div>

    </div>

</template>

<style lang="less" scoped>

    .box {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3;
        .mask {
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, .5);
        }
        .windowBox {
            position: absolute;
            padding-bottom: 10px;
            border: 1px solid #009DBF;
            border-radius: 12px;
            background-color: white;
            .tabBox {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                height: 50px;
                font-size: 24px;
                color: gray;
                .close {
                    position: relative;
                    color: gray;
                    font-weight: 700;
                    border: none;
                    background: none;
                    &:hover {
                        color: #009DBF;
                    }
                }
            }
            hr {
                margin: auto;
                width: 90%;
                border: 1px solid lightgray;
            }
        }
    }

</style>