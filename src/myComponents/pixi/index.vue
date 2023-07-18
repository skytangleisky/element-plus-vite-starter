<template>
</template>
<script lang="ts" setup>
import { onMounted,ref } from 'vue';
import * as PIXI from 'pixi.js';
import textureUrl from './wabbit_alpha.png?url'
let myCvs = ref(null)
onMounted(()=>{
    var renderer = PIXI.autoDetectRenderer({backgroundAlpha:0});
    renderer.view.style['transform'] = 'translatez(0)';
    renderer.view.addEventListener('click', function() { addBunnies(10); });
    // document.body.insertBefore(renderer.view, document.body.firstChild)
    document.body.append(renderer.view)

    var bunnies:any[] = [];
    var gravity = 0.5;
    var minX = 0;
    var maxX = renderer.width - 26;
    var minY = 0;
    var maxY = renderer.height - 37;
    var bunniesCount = 0;

    var totalText = document.getElementById('total');

    // create the root of the scene graph

    // simpler
    // var stage = new PIXI.Container();

    // faster
    // http://pixijs.github.io/docs/PIXI.ParticleContainer.html
    var stage = new PIXI.ParticleContainer(200000);

    var texture = PIXI.Texture.from(textureUrl);



    updateTotalText();
    animate();

    function animate() 
    {
        update();
        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    function update()
    {
        for (let i = 0; i < bunnies.length; i++)
        {
            bunnies[i].spt.position.x += bunnies[i].speedX;
            bunnies[i].spt.position.y += bunnies[i].speedY;
            bunnies[i].speedY += gravity;

            if (bunnies[i].spt.position.x > maxX)
            {
                bunnies[i].speedX *= -1;
                bunnies[i].spt.position.x = maxX;
            }
            else if (bunnies[i].spt.position.x < minX)
            {
                bunnies[i].speedX *= -1;
                bunnies[i].spt.position.x = minX;
            }
            if (bunnies[i].spt.position.y > maxY)
            {
                bunnies[i].speedY *= -0.8;
                bunnies[i].spt.position.y = maxY;
                if (Math.random() > 0.5) bunnies[i].speedY -= 3 + Math.random() * 4;
            } 
            else if (bunnies[i].spt.position.y < minY)
            {
                bunnies[i].speedY = 0;
                bunnies[i].spt.position.y = minY;
            }
        }
    }

    function addBunnies(count:number)
    {
        for(let i = 0; i < count; i++)
        {
            var bunny = {
                spt: new PIXI.Sprite(texture),
                speedX: Math.random() * 5,
                speedY: (Math.random() * 5) - 2.5
            };
            bunny.spt.cursor = 'pointer';
            bunny.spt.interactive=true
            bunnies.push(bunny);
            stage.addChild(bunny.spt);
        }
        console.log('addBunnies')

        bunniesCount += count;
        updateTotalText();
    }

    function updateTotalText()
    {
        if(!totalText)throw Error()
        totalText.innerHTML = 'Total: ' + bunniesCount;
    }
})

</script>
<style lang="scss">
    body>canvas{
        position: absolute;
        width:100%;
        height:100%;
    }
    #total{
        position: absolute;
        top:0;
        left:0;
        z-index: 999;
    }
</style>