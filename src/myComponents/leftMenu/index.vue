<template>
<div class="flex-col" style="color:black;background-color: #fff;">
<div class="icons">
    <span v-for="v in menus"><i class="icon" style="margin-right: 10px;width:2em;height:2em;" v-html="v.svg"></i>{{ v.name }}</span>
</div>
    <h1>Nestable2</h1>
    <el-button text @click="dialogFormVisible = true">open a Form nested Dialog</el-button>
    <el-dialog v-model="dialogFormVisible" title="Icon">
        <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">
            <el-form-item label="id">
                <el-input v-model="form.id" placeholder="autogeneration"/>
            </el-form-item>
            <el-form-item label="uuid">
                <el-input v-model="form.uuid" placeholder="autogeneration"/>
            </el-form-item>
            <el-form-item label="createtime">
                <el-input v-model="form.createtime" placeholder="autogeneration"/>
            </el-form-item>
            <el-form-item label="updatetime">
                <el-input v-model="form.updatetime" placeholder="autogeneration"/>
            </el-form-item>
            <el-form-item label="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="svg">
                <el-input v-model="form.svg" />
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

<p>Drag &amp; drop hierarchical list with mouse and touch compatibility (jQuery plugin)</p>

<p><strong><a href="https://github.com/RamonSmit/Nestable2">Code on GitHub</a></strong></p>

<menu id="nestable-menu">
    <button type="button" data-action="expand-all">Expand All</button>
    <button type="button" data-action="collapse-all">Collapse All</button>
    <button type="button" data-action="add-item">Add new item</button>
    <button type="button" data-action="replace-item">Replace item 10</button>
    <button type="button" data-action="remove-item">Remove item</button>
</menu>

<div class="cf nestable-lists">

    <div class="dd" id="nestable"></div>

    <div class="dd" id="nestable2">
        <ol class="dd-list">
            <li class="dd-item" data-id="13">
                <div class="dd-handle">Item 13</div>
            </li>
            <li class="dd-item" data-id="14">
                <div class="dd-handle">Item 14</div>
            </li>
            <li class="dd-item" data-id="15">
                <div class="dd-handle">Item 15</div>
                <ol class="dd-list">
                    <li class="dd-item" data-id="16">
                        <div class="dd-handle">Item 16</div>
                    </li>
                    <li class="dd-item" data-id="17">
                        <div class="dd-handle">Item 17</div>
                    </li>
                    <li class="dd-item" data-id="18">
                        <div class="dd-handle">Item 18</div>
                    </li>
                </ol>
            </li>
        </ol>
    </div>

</div>

<p><strong>Serialised Output (per list)</strong></p>

<textarea id="nestable-output"></textarea>
<textarea id="nestable2-output"></textarea>

<p>&nbsp;</p>

<div class="cf nestable-lists">

    <p><strong>Draggable Handles</strong></p>

    <p>If you're clever with your CSS and markup this can be achieved without any JavaScript changes.</p>

    <div class="dd" id="nestable3">
        <ol class="dd-list">
            <li class="dd-item dd3-item" data-id="13">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 13</div>
            </li>
            <li class="dd-item dd3-item" data-id="14">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 14</div>
            </li>
            <li class="dd-item dd3-item" data-id="15">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 15</div>
                <ol class="dd-list">
                    <li class="dd-item dd3-item" data-id="16">
                        <div class="dd-handle dd3-handle">Drag</div>
                        <div class="dd3-content">Item 16</div>
                    </li>
                    <li class="dd-item dd3-item" data-id="17">
                        <div class="dd-handle dd3-handle">Drag</div>
                        <div class="dd3-content">Item 17</div>
                    </li>
                    <li class="dd-item dd3-item" data-id="18">
                        <div class="dd-handle dd3-handle">Drag</div>
                        <div class="dd3-content">Item 18</div>
                    </li>
                </ol>
            </li>
        </ol>
    </div>

</div>

<p class="small">Copyright &copy; <a href="http://dbushell.com/">David Bushell</a> | Made for <a href="http://www.browserlondon.com/">Browser</a></p>
</div>

</template>
<script lang="ts" setup>
    import {ref,reactive,onMounted,onBeforeUnmount} from 'vue'
    import {fetchList,saveData} from '~/api/icon.js'
    import type { FormInstance, FormRules } from 'element-plus'
    import './jquery.nestable.js'
    import './jquery.nestable.scss'


    const ruleFormRef = ref<FormInstance>()
    const rules = reactive<FormRules<typeof form>>({
    })

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        dialogFormVisible.value = false
        formEl.validate((valid) => {
            if (valid) {
                console.log('submit!')
                console.log(JSON.stringify(form))
                saveData([form]).then(res=>{
                    console.log(res)
                }).catch(e=>{
                    throw e
                })
            } else {
                console.log('error submit!')
                return false
            }
        })
    }

    const menus = ref([
        {svg:`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path></svg>`},
        {svg:`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path></svg>`},
        {svg:`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path></svg>`},
        {svg:`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path></svg>`},
        {svg:`
        <svg id="图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 9.56"><defs><style>.cls-1{fill:#fff;stroke:#231815;stroke-miterlimit:10;}</style></defs><ellipse class="cls-1" cx="16.5" cy="4.78" rx="16" ry="4.28"/></svg>`},
    ])

    const dialogFormVisible = ref(false)
    const form = reactive({
        id:undefined,
        uuid:undefined,
        createtime:undefined,
        updatetime:undefined,
        name:null,
        svg:null,
    })
    fetchList().then(res=>{
        menus.value = res.data.results
    }).catch(e=>{
        throw e
    })
    onMounted(()=>{
        $(document).ready(function() {
            var updateOutput = function(e) {
                var list = e.length ? e : $(e.target),
                    output = list.data('output');
                if(window.JSON) {
                    output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
                }
                else {
                    output.val('JSON browser support required for this demo.');
                }
            };

            var json = [
                {
                    "id": 1,
                    "content": '<i class="icon" style="color:orange">'+menus.value[0].svg+'</i>' + "First item",
                    "classes": ["dd-nochildren"]
                },
                {
                    "id": 2,
                    "content": "Second item",
                    "children": [
                        {
                            "id": 3,
                            "content": "Item 3"
                        },
                        {
                            "id": 4,
                            "content": "Item 4"
                        },
                        {
                            "id": 5,
                            "content": "Item 5",
                            "value": "Item 5 value",
                            "foo": "Bar",
                            "children": [
                                {
                                    "id": 6,
                                    "content": "Item 6"
                                },
                                {
                                    "id": 7,
                                    "content": "Item 7"
                                },
                                {
                                    "id": 8,
                                    "content": "Item 8"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 9,
                    "content": "Item 9"
                },
                {
                    "id": 10,
                    "content": "Item 10",
                    "children": [
                        {
                            "id": 11,
                            "content": "Item 11",
                            "children": [
                                {
                                    "id": 12,
                                    "content": "Item 12"
                                }
                            ]
                        }
                    ]
                }
            ];
            var lastId = 12;

            // activate Nestable for list 1
            $('#nestable').nestable({
                group: 1,
                json: json,
                contentCallback: function(item) {
                    var content = item.content || '' ? item.content : item.id;
                    content += ' <i>(id = ' + item.id + ')</i>';

                    return content;
                },
            }).on('change', updateOutput);



            // activate Nestable for list 2
            $('#nestable2').nestable({
                group: 1
            }).on('change', updateOutput);

            // output initial serialised data
            updateOutput($('#nestable').data('output', $('#nestable-output')));
            updateOutput($('#nestable2').data('output', $('#nestable2-output')));

            $('#nestable-menu').on('click', function(e) {
                var target = $(e.target),
                    action = target.data('action');
                if(action === 'expand-all') {
                    $('.dd').nestable('expandAll');
                }
                if(action === 'collapse-all') {
                    $('.dd').nestable('collapseAll');
                }
                if(action === 'add-item') {
                    var newItem = {
                        "id": ++lastId,
                        "content": "Item " + lastId,
                        "children": [
                            {
                                "id": ++lastId,
                                "content": "Item " + lastId,
                                "children": [
                                    {
                                        "id": ++lastId,
                                        "content": "Item " + lastId
                                    }
                                ]
                            }
                        ]
                    };
                    $('#nestable').nestable('add', newItem);
                }
                if(action === 'remove-item'){
                    $('#nestable').nestable('remove',lastId--)
                }
                if(action === 'replace-item') {
                    var replacedItem = {
                        "id": 10,
                        "content": "New item 10",
                        "children": [
                            {
                                "id": ++lastId,
                                "content": "Item " + lastId,
                                "children": [
                                    {
                                        "id": ++lastId,
                                        "content": "Item " + lastId
                                    }
                                ]
                            }
                        ]
                    };
                    $('#nestable').nestable('replace', replacedItem);
                }
            });
            $('#nestable3').nestable();

        })
    })
    // onBeforeUnmount(()=>{
    //     $('.dd').nestable('removeAll')
    //     $('.dd').nestable('destroy')
    // })
</script>
<style lang="scss">
    .cf:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    * html .cf {
        zoom: 1;
    }

    *:first-child + html .cf {
        zoom: 1;
    }


    h1 {
        font-size: 1.75em;
        margin: 0 0 0.6em 0;
    }

    a {
        color: #2996cc;
    }

    a:hover {
        text-decoration: none;
    }

    p {
        line-height: 1.5em;
    }

    .small {
        color: #666;
        font-size: 0.875em;
    }

    .large {
        font-size: 1.25em;
    }

    /**
        * Nestable Extras
        */

    .nestable-lists {
        display: block;
        clear: both;
        padding: 30px 0;
        width: 100%;
        border: 0;
        border-top: 2px solid #ddd;
        border-bottom: 2px solid #ddd;
    }

    #nestable-menu {
        padding: 0;
        margin: 20px 0;
    }

    #nestable-output,
    #nestable2-output {
        width: 100%;
        height: 7em;
        font-size: 0.75em;
        line-height: 1.333333em;
        font-family: Consolas, monospace;
        padding: 5px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }

    #nestable2 .dd-handle {
        color: #fff;
        border: 1px solid #999;
        background: #bbb;
        background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
        background: -moz-linear-gradient(top, #bbb 0%, #999 100%);
        background: linear-gradient(top, #bbb 0%, #999 100%);
    }

    #nestable2 .dd-handle:hover {
        background: #bbb;
    }

    #nestable2 .dd-item > button:before {
        color: #fff;
    }

    @media only screen and (min-width: 700px) {

        .dd {
            float: left;
            width: 48%;
        }

        .dd + .dd {
            margin-left: 2%;
        }

    }

    .dd-hover > .dd-handle {
        background: #2ea8e5 !important;
    }

    /**
        * Nestable Draggable Handles
        */

    .dd3-content {
        display: block;
        height: 30px;
        margin: 5px 0;
        padding: 5px 10px 5px 40px;
        color: #333;
        text-decoration: none;
        font-weight: bold;
        border: 1px solid #ccc;
        background: #fafafa;
        background: -webkit-linear-gradient(top, #fafafa 0%, #eee 100%);
        background: -moz-linear-gradient(top, #fafafa 0%, #eee 100%);
        background: linear-gradient(top, #fafafa 0%, #eee 100%);
        -webkit-border-radius: 3px;
        border-radius: 3px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }

    .dd3-content:hover {
        color: #2ea8e5;
        background: #fff;
    }

    .dd-dragel > .dd3-item > .dd3-content {
        margin: 0;
    }

    .dd3-item > button {
        margin-left: 30px;
    }

    .dd3-handle {
        position: absolute;
        margin: 0;
        left: 0;
        top: 0;
        cursor: pointer;
        width: 30px;
        text-indent: 30px;
        white-space: nowrap;
        overflow: hidden;
        border: 1px solid #aaa;
        background: #ddd;
        background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);
        background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);
        background: linear-gradient(top, #ddd 0%, #bbb 100%);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .dd3-handle:before {
        content: '≡';
        display: block;
        position: absolute;
        left: 0;
        top: 3px;
        width: 100%;
        text-align: center;
        text-indent: 0;
        color: #fff;
        font-size: 20px;
        font-weight: normal;
    }

    .dd3-handle:hover {
        background: #ddd;
    }

    .icons{
        border:1px solid red;
        display: grid;
        // grid-template-rows: repeat(3, minmax(0, 1fr));
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap:10px;
        place-items: start;
        place-content: center;
        span{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .icon {
        height: 1em;
        width: 1em;
        line-height: 1em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        // color:red;
        fill:currentColor;
        font-size: inherit;
        svg{
            width: inherit;
            height: inherit;
        }
    }
</style>