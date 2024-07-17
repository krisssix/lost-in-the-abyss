import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/zombie'
import './components/mannequin'
import './components/obstacle'
import './components/item'
import './components/collider-check'
import './shaders/glowing'

document.querySelector('#app').innerHTML = `
    
    <div id="intro-screen">
    <img src="/textures/intro-screen.png" id="intro" style="display: block;">
    <img src="/textures/intro-screen-play.png" id="introPlay" style="display: none;">
    <button id="play-button" style="display: none;">Play Now</button>
    </div>  
    
    <div id="game-container">
        <div id="game-over">You lost! Better luck next time.</div>
        <div id="victory">Great job. You made it home!</div>
        
        <div id="pickup">Press P to pick up this item</div>
        <div id="doorMessage">Press E to open the door</div>
        
    <a-scene> 
        <!-- External files -->
        <a-assets>
            <a-asset-item id="megan" src="/models/megan.glb"></a-asset-item>
            <a-asset-item id="zombie" src="/models/zombie.glb"></a-asset-item>
            <a-asset-item id="medkit" src="/models/medkit.glb"></a-asset-item>
            <a-asset-item id="battery" src="/models/battery.glb"></a-asset-item>
            <a-asset-item id="mannequin" src="/models/mannequin.glb"></a-asset-item>
            <a-asset-item id="labyrinth" src="/models/labrint2.glb"></a-asset-item>
            <a-asset-item id="key" src="/models/Key.glb"></a-asset-item>
            <a-asset-item id="statue" src="/models/socha.glb"></a-asset-item>
            <a-asset-item id="house" src="/models/house.glb"></a-asset-item>
            
             <!-- Not yet added -->
            <a-asset-item id="barrell" src="/models/barrell.glb"></a-asset-item>
            <a-asset-item id="bookcase" src="/models/bookcase.glb"></a-asset-item>
            <a-asset-item id="chair" src="/models/chair.glb"></a-asset-item>
            <a-asset-item id="box" src="/models/box.glb"></a-asset-item>
            <a-asset-item id="bench" src="/models/bench.glb"></a-asset-item>
            
            
            <a-asset-item id="sofa" src="/models/sofa.glb"></a-asset-item>
            <a-asset-item id="picture" src="/models/picture.glb"></a-asset-item>
            <a-asset-item id="table" src="/models/table.glb"></a-asset-item>
            <a-asset-item id="desk" src="/models/desk.glb"></a-asset-item>
            <a-asset-item id="fireplace" src="/models/fireplace.glb"></a-asset-item>
            
            
            
            <img src="/textures/dirt.jpg" id="dirt">
            <img src="/textures/bush.jpg" id="bush">
            <img src="/textures/glow.png" id="glow">
            <img src="/models/keyFound.png" id="keyFound">
            <img src="/models/keyNoo.png" id="keyNo">
            <img src="/models/bush.png" id="bush">
            <img src="/textures/hole.jpg" id="hole">
            <img src="/textures/night.jpg" id="night">
            <audio id="zombie-sound" src="/sounds/zombie-sound.mp3"></audio>
            <audio id="rattle" src="/sounds/rattling-bones.mp3"></audio>
            <audio id="bones" src="/sounds/bones.mp3"></audio>
            <audio id="night-sound" src="/sounds/night-time.mp3"></audio>
            <img src="/textures/statueCylinder.jpg" id="statueCylinder">
            <img src="/textures/intro-screen-play.png" id="introPlay">
            <img src="/textures/intro-screen.png" id="intro">
        </a-assets>
  
        <!--  sky    --> <a-sky material="src: #night; repeat:15 15;"></a-sky>
        <!--  ground --> <a-box shadow="receive: true" static-body="friction: 0;" position="0 0 -4" rotation="-90 0 0" width="100" height="100" depth="0.8" material="src: #dirt; repeat:15 15;"></a-box> 

        <!-- Lights -->
        <a-entity light="type: ambient; color: #555; intensity: 0.8"></a-entity>
        
        <!-- Maze Walls -->
           
            <!-- Health Potion Items -->
             <a-entity  shadow="receive: true" item="health potion" position="1.767 0.470 -12.252" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model= "#medkit" scale="3 3 3">
                <a-box item="health potion" position="-0.113 -0.101 0" scale="0.340 0.460 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" item="health potion" position="1.767 0.470 13.516" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model= "#medkit" scale="3 3 3">
                <a-box item="health potion" position="-0.113 -0.101 0" scale="0.340 0.460 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" item="health potion" position="1.767 0.470 -28.463" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model= "#medkit" scale="3 3 3">
                <a-box item="health potion" position="-0.113 -0.101 0" scale="0.340 0.460 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" item="health potion" position="-31.211 0.470 23.720" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model= "#medkit" scale="3 3 3">
                <a-box item="health potion" position="-0.113 -0.101 0" scale="0.340 0.460 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
            
            <!-- END: Health Potion Items -->
            
            <!-- Benches -->
             <a-entity  shadow="receive: true" class="bench" position="14.849 0.5 -23.338" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="bench" position="-21.971 0.5 -2.768" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="bench" position="36.776 0.5 -24.823" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
            <!-- Battery on a bench -->
             <a-entity  shadow="receive: true" class="battery" item="battery" position="-45.833 1.306 -25.977" static-body="shape: box;" rotation="0 0 0" gltf-model="#battery" scale="0.009 0.009 0.009">
                <a-box item="battery" position="0 0 0" scale="0.340 4.000 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- Battery on a bench -->
            
             <a-entity  shadow="receive: true" class="bench" position="36.776 0.5 -45.241" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="bench" position="-4.007 0.5 -35.538" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="bench" position="-45.055 0.5 -24.784" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.238 0.154 0.000" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="bench" position="0 0.5 -11.507" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.208 0.174 -0.100" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <!-- Battery on a bench -->
             <a-entity  shadow="receive: true" class="bench" position="19.824 0.5 17.217" static-body="shape: box;" rotation="0 90 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.208 0.174 -0.100" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <a-entity  shadow="receive: true" class="battery" item="battery" position="20.761 1.306 17.626" static-body="shape: box;" rotation="0 0 0" gltf-model="#battery" scale="0.009 0.009 0.009">
                <a-box item="battery" position="0 0 0" scale="0.340 4.000 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <!-- END: Battery on a bench -->
             
             
             <!-- Battery on a bench -->
             <a-entity  shadow="receive: true" class="bench" position="-11.910 0.500 -27.932" static-body="shape: box;" rotation="0 90 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.208 0.174 -0.100" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <a-entity  shadow="receive: true" class="battery" item="battery" position="-12.245 1.306 -27.059" static-body="shape: box;" rotation="0 0 0" gltf-model="#battery" scale="0.009 0.009 0.009">
                <a-box item="battery" position="0 0 0" scale="0.340 4.000 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <!-- END: Battery on a bench -->
            
             <!-- Battery on a bench -->
             <a-entity  shadow="receive: true" class="bench" position="-9.226 0.5 12.869" static-body="shape: box;" rotation="0 90 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.208 0.174 -0.100" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <a-entity  shadow="receive: true" class="battery" item="battery" position="-10.803 1.306 13.664" static-body="shape: box;" rotation="0 0 0" gltf-model="#battery" scale="0.009 0.009 0.009">
                <a-box item="battery" position="0 0 0" scale="0.340 4.000 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
             <!-- END: Battery on a bench -->
            
            <!-- Battery on a bench -->
             <a-entity  shadow="receive: true" class="battery" item="battery" position="-0.927 1.306 -11.507" static-body="shape: box;" rotation="0 0 0" gltf-model="#battery" scale="0.009 0.009 0.009">
                <a-box item="battery" position="0 0 0" scale="0.340 4.000 0.180" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="bench" position="2.482 0.5 -11.507" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#bench" scale="3 3 3">
                <a-box class="bench" position="-0.208 0.174 -0.100" scale="0.160 0.790 0.470" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Battery on a bench--> 
            
             <!-- Bookcase  -->
             <a-entity  shadow="receive: true" class="bookcase" position="42.525 0.418 22.936" static-body="shape: box;" rotation="0 -180 0" visible="true" gltf-model="#bookcase" scale="1.5 1.5 1.5">
                <a-box class="bookcase" position="0 1.113 -0.828" scale="0.360 2.920 0.820" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Bookcase -->
            
            
             <!-- Desk  -->
             <a-entity  shadow="receive: true" class="desk" position="41.898 1.254 35.436" static-body="shape: box;" rotation="0 -180 0" visible="true" gltf-model="#desk" scale="0.003 0.003 0.003">
                <a-box class="desk" position="0 1.744 -0.828" scale="0.360 2.920 0.820" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Desk -->
            
            
            
            <!-- Sofas  -->
             <a-entity  shadow="receive: true" class="sofa" position="41.885 1.144 31.299" static-body="shape: box;" rotation="0 -180 0" visible="true" gltf-model="#sofa" scale="1.5 1.5 1.5">
                <a-box class="sofa" position="0.184 0.740 -0.429" scale="0.360 2.920 0.820" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="sofa" position="33.966 1.192 29.908" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#sofa" scale="1.5 1.5 1.5">
                <a-box class="sofa" position="0.184 0.740 -0.429" scale="0.360 2.920 0.820" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Sofas --> 
            
            <!-- House collision boxes  -->
            <a-box class="house-collision-box" position="42.625 1.192 29.994" scale="0.460 6.980 7.360 " static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            <a-box class="house-collision-box" position="33.452  1.192 29.994" scale="0.460 6.980 7.360" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            <a-box class="house-collision-box" position="32.775 1.192 36.864" scale="0.460 6.980 5.350" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            <a-box class="house-collision-box" position="34.141 1.192 22.618" scale="0.460 6.980 2.200" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            <a-box class="house-collision-box" position="41.157 1.192 22.618" scale="0.460 6.980 2.200" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            
            <a-box item="door" class="house-collision-box-door" position="37.912 1.192 22.618" scale="0.460 6.980 2.200" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            
            <a-box class="house-collision-box" position="37.563 1.192 37.310" scale="0.460 6.980 4.940" static-body="shape: box;" rotation="0 90 0" width="2" height="1" depth="2" visible="false"></a-box>
            <a-box class="house-collision-box" position="41.592 1.192 24.600" scale="0.460 6.980 1.530" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            <!-- END: House collision boxes -->
            

            
             <!-- Fireplace  -->
             <a-entity  shadow="receive: true" class="fireplace" position="33.486 0.401 34.398" static-body="shape: box;" rotation="0 -180 0" visible="true" gltf-model="#fireplace" scale="1 1 1">
                <a-box class="fireplace" position="1.150 -0.732 0.115" scale="0.360 2.920 2.240" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Fireplace -->
            
             <!-- Chair  -->
             <a-entity  shadow="receive: true" class="chair" position="40.908 0.500 35.436" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#chair" scale="1 1 1">
                <a-box class="chair" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 -90 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Chair -->
            
             <!-- Picture  -->
             <a-entity  shadow="receive: true" class="picture" position="42.888 2.377 33.779" static-body="shape: box;" rotation="0 -180 0" visible="true" gltf-model="#picture" scale="0.870 0.870 0.870">
                <a-box class="picture" position="0 1.744 -0.828" scale="0.360 2.920 0.820" static-body="shape: box;" rotation="0 -180 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Picture -->
            
            <!-- Barrells  -->
             <a-entity  shadow="receive: true" class="barrell" position="5 0.5 15" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="barrell" position="13.979 0.5 16.083" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="barrell" position="-19.286 0.5 2.243" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="barrell" position="-19.286 0.5 32.481" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="barrell" position="-11.809 0.5 38.953" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
              <a-entity  shadow="receive: true" class="barrell" position="31.739 0.5 38.953" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#barrell" scale="1 1 1">
                <a-box class="barrell" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            <!-- END: Barrells -->
            
          
            
              <a-entity  shadow="receive: true" class="box" position="1.386 0.913 8.630" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="-32.074 0.913 -35.991" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="44.742 0.913 9.340" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="-30.728 0.913 -16.639" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="-20.344 0.913 13.350" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="-5.380 0.913 13.350" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
             <a-entity  shadow="receive: true" class="box" position="19.506 0.913 -35.991" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
            <!-- END: Boxes -->
            
           <!-- Key placement -->
            <a-entity  shadow="receive: true" class="key" item="key" position="-0.100 1.484 0.165" static-body="shape: box;" rotation="0 0 0" visible="true" material="src: #bush; repeat: 1 5;" gltf-model="#key" scale="0.5 0.5 0.5">
                <a-box item="key" position="0 0.154 0" scale="0.870 2.460 0.870" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
                    <a-image width="2" height="2" src="#glow" look-at="#player" color="yellow" material="transparent: true; opacity: 1.0; alphaTest: 0.01;" animation__pulse="property: material.opacity; from: 1.0; to: 0.0; dur: 1000; loop: true; dir: alternate; easing: linear;" rotation="90 0 0"></a-image>
            </a-entity>
            
            <a-entity  shadow="receive: true" class="key" item="key" position="-32.443 1.484 -16.700" static-body="shape: box;" rotation="0 0 0" visible="true" material="src: #bush; repeat: 1 5;" gltf-model="#key" scale="0.5 0.5 0.5">
                <a-box item="key" position="0 0.154 0" scale="0.870 2.460 0.870" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
                    <a-image width="2" height="2" src="#glow" look-at="#player" color="yellow" material="transparent: true; opacity: 1.0; alphaTest: 0.01;" animation__pulse="property: material.opacity; from: 1.0; to: 0.0; dur: 1000; loop: true; dir: alternate; easing: linear;" rotation="90 0 0"></a-image>
            </a-entity>
            
            <a-entity  shadow="receive: true" class="key" item="key" position="35.748 1.449 -45.171" static-body="shape: box;" rotation="0 0 0" visible="true" material="src: #bush; repeat: 1 5;" gltf-model="#key" scale="0.5 0.5 0.5">
                <a-box item="key" position="0 0.154 0" scale="0.870 2.460 0.870" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
                    <a-image width="2" height="2" src="#glow" look-at="#player" color="yellow" material="transparent: true; opacity: 1.0; alphaTest: 0.01;" animation__pulse="property: material.opacity; from: 1.0; to: 0.0; dur: 1000; loop: true; dir: alternate; easing: linear;" rotation="90 0 0"></a-image>
            </a-entity>
             
           <!-- Boxes  -->
             <a-entity  shadow="receive: true" class="box" position="1.878 0.913 0" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#box" scale="0.5 0.5 0.5">
                <a-box class="box" position="-3.210 -0.453 0.000" scale="0.830 3.640 0.970" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
           
            
            
          <!-- END: Key -->
            
            
            <!-- Statue -->
             <a-entity  shadow="receive: true" class="statue" position="-3.327 0.374 -7.372" static-body="shape: box;" rotation="0 0 0" visible="true" gltf-model="#statue" scale="0.015 0.015 0.015">
                <a-box class="statue" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" visible="false"></a-box>
            </a-entity>
            
            <a-cylinder class="statue collidable" position="-3.327 0.191 -7.362" scale="0.850 0.850 0.850" static-body="shape: box;" material="src: #statueCylinder" rotation="0 0 0" width="2" height="1" depth="2" ></a-cylinder>
            
            <!-- END: Statue -->
            
              <!-- House -->
             <a-entity  shadow="receive: true" class="house collidable" position="37.713 0 29.908" static-body="shape: box;" rotation="0 180 0" visible="true" gltf-model="#house" scale="1.5 1.5 1.5">
                <a-box class="house" position="0 0.154 0" scale="0.540 0.840 0.310" static-body="shape: box;" rotation="-90 0 0" width="2" height="1" depth="2" visible="false"></a-box>
               
                <a-entity id="light" visible="true" light="type: spot; angle: 50; penumbra: 1; intensity: 3; castShadow: true" position="0 3 0" rotation="-90 0 0"></a-entity>

            </a-entity>
            <!-- END: House --> 
            
        <!-- Holes -->
        <a-box item="hole" class="hole" position="-2.072  -0.085 -28.727" scale="3 1 3" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        <a-box item="hole" class="hole" position="-18.353 -0.085 9.015" scale="3.5 1 3.5" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        <a-box item="hole" class="hole" position="-45.385 -0.085 -6.270" scale="3.5 1 3.5" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        <a-box item="hole" class="hole" position="-33.690 -0.085 20.080" scale="2 1 2" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        <a-box item="hole" class="hole" position="8.040 -0.085 20.080" scale="2 1 2" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        <a-box item="hole" class="hole" position="30.649 -0.085 1.547" scale="2 1 2" static-body="shape: box;" rotation="0 0 0" width="2" height="1" depth="2" material="src: #hole"></a-box>
        
        
        <!-- END: Holes -->
        
        
        <!-- Maze Walls -->
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-20 0.5 -44.5" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="17.033 0.5 36" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="10.210 0.5 36" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-7.385 0.5 11.014" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-3.154 0.5 20.858" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="3.143 0.5 30" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-40 0.5 10.403" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="19.578 0.5 20" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-30 0.5 11.014" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="9.451 0.5 -49.160" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="14.593 0.5 -40.000" scale="1 1 0.5" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="41.049 0.5 -4.000" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-10 0.5 29.501" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-40 0.5 -38.858" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="21.987 0.5 0.599" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-25.365 0.5 -11.541" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-15.169 0.5 -21.149" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="30 0.5 -20" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-30 0.5 -30" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="20 0.5 -30" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="10 0.5 -30" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-10.934 0.5 -4.775" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-6.502 0.5 -31.718" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-33.889 0.5 -40" scale="1 1 0.610" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="-20 0.5 20" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true"  static-body="shape: box; mass: 1;" position="0 0.5 -40" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5  ;"></a-box>
        <!-- Inner Walls -->
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-15 0.5 5" rotation="0 90 0" width="2.5" height="20" depth="18" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="30 0.5 -15" rotation="0 90 0" width="2.5" height="20" depth="24" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-3.565 0.5 -15.969" rotation="0 90 0" width="2.5" height="20" depth="16" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="34.699 0.5 0.410" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="45.662 0.5 -30.755" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="11.392 0.5 1.091" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="4.744 0.5 -7.090" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-25.584 0.5 35.514" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="0.257  0.500 -53.264"  scale="1 1 3.4" rotation="0 90 0" width="2.5" height="20" depth="30" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="0.257  0.500 45.928"  scale="1 1 3.4" rotation="0 90 0" width="2.5" height="20" depth="30" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-49.843 0.500 -3.625"  scale="1 1 3.4" rotation="0 0 0" width="2.5" height="20" depth="30" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="49.843 0.500 -3.625"  scale="1 1 3.4" rotation="0 0 0" width="2.5" height="20" depth="30" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="40 0.5 -30" rotation="0 0 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-40 0.5 40" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="14.423 0.5 -7.876" rotation="0 90 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-45.476 0.5 -20.770" rotation="0 90 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="28.187 0.5 6.537" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="31.045 0.5 -8.803" rotation="0 90 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="17.861 0.5 -11.372" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-8.385 0.5 -33.069" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="27.030  0.5 -42.834" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-42.804 0.5 -16.339" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-42.804 0.5 -16.339" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-17.023 0.5 30.706" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="10.620 0.5 18.711" rotation="0 0 0" width="2.5" height="20" depth="8" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="25 0.5 10" rotation="0 90 0" width="2.5" height="20" depth="6" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-35.079 0.5 30" rotation="0 0 0" width="2.5" height="20" depth="12" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="35.882 0.5 -40.174" rotation="0 90 0" width="2.5" height="20" depth="20" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-45 0.5 25.679" rotation="0 0 0" width="2.5" height="20" depth="30" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-30.468 0.500 -20.330" scale="1 1 0.270" rotation="0 90 0" width="2.5" height="20" depth="40" material="src: #bush; repeat: 1 5;"></a-box>
        <a-box class="maze-wall collidable" shadow="receive: true" static-body="shape: box; mass: 1;" position="-35.442 0.5 -10.154" scale="1 1 0.460" rotation="0 0 0" width="2.5" height="20" depth="50" material="src: #bush; repeat: 1 5;"></a-box>
        <!-- END: Maze walls -->
        
        


        <!-- Character -->
         <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" rotation="0 0 0" position="-48 0.5 -49" id="character" character >
             <a-entity  shadow="receive: true" gltf-model="#megan" animation-mixer="clip: idle;" position="0 0 0" rotation="0 0 0" scale="1 1 1">
                 <a-entity  shadow="receive: true" id="flashlight" visible="false" light="type: spot; angle: 30; penumbra: 0.5; intensity: 9; castShadow: true" position="0 2 0.5" rotation="-30 180 0"></a-entity>
                 <a-entity  shadow="receive: true" camera position="0 2 -1.5" rotation="-25 -180 0"></a-entity>
            </a-entity>
             <a-entity  shadow="receive: true" raycaster="direction: 0 0 -1; far: 4;" position="0 1.6 0" collider-check="target: .collidable"></a-entity>
        </a-entity>
        
        
        <!-- Enemies -->
        <!-- Zombies -->
         <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-0.5 0.5 13.5" rotation="0 180 0" zombie="target: #character; speed: 2;">
             <a-entity  shadow="receive: true" gltf-model="#zombie" animation-mixer="clip: idle;" position="0 0 0" rotation="0 -90 0" scale="1 1 1"></a-entity>
        </a-entity>
        <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-44.22 0.5 -24.857" rotation="0 180 0" zombie="target: #character; speed: 2;">
             <a-entity  shadow="receive: true" gltf-model="#zombie" animation-mixer="clip: idle;" position="0 0 0" rotation="0 -80 0" scale="1 1 1"></a-entity>
        </a-entity>
        <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="37.681 0.5 -29.897" rotation="0 180 0" zombie="target: #character; speed: 2;">
             <a-entity  shadow="receive: true" gltf-model="#zombie" animation-mixer="clip: idle;" position="0 0 0" rotation="0 -80 0" scale="1 1 1"></a-entity>
        </a-entity>
        <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-28.5 0.5 40.6" rotation="0 180 0" zombie="target: #character; speed: 2;">
             <a-entity  shadow="receive: true" gltf-model="#zombie" animation-mixer="clip: idle;" position="0 0 0" rotation="0 -85 0" scale="1 1 1"></a-entity>
        </a-entity>
        
        <!-- Mannequin -->
         <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-8 0.5 -27.635" rotation="0 180 0" mannequin="target: #character;">
             <a-entity  shadow="receive: true" gltf-model="#mannequin" animation-mixer="clip: 1;" position="0 0 0" rotation="0 180 0" scale="1 1 1"></a-entity>
        </a-entity>
        <a-entity  shadow="receive: true" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-30 0.5 31" rotation="0 180 0" mannequin="target: #character;">
             <a-entity  shadow="receive: true" gltf-model="#mannequin" animation-mixer="clip: 1;" position="0 0 0" rotation="0 -45 0" scale="1 1 1"></a-entity>
        </a-entity>
        
        <!-- Sounds -->
         <a-entity id="zombie-sound-entity" sound="src: #zombie-sound; autoplay: false; volume: 14;" position="0 10 0"></a-entity>
         <a-entity id="bones-sound-entity" sound="src: #bones; autoplay: false; volume: 14;" position="0 10 0"></a-entity>
         <a-entity id="rattling-sound-entity" sound="src: #rattle; autoplay: false; volume: 14;" position="0 10 0"></a-entity>
         <a-entity id="night-sound-entity" sound="src: #night-sound; autoplay: false; loop: true; volume: 04;" position="0 10 0"></a-entity>

    </a-scene>
    
    <!-- UI -->
    
     <div id="battery-display" style="display: inline">Battery: 100%</div>
    <div id="health-display" style="display: inline">Health: 100%</div>
    <div id="stamina-display" style="display: inline">Stamina: 100%</div>
    <div id="key-display" style="display: inline">Keys found: 0/3</div>
    
    <div id="battery-container" class="progress-container">
    <div id="battery-bar" class="progress-bar"></div>
    <div id="battery-display" class="progress-text">Battery: 100%</div>
</div>
<div id="health-container" class="progress-container">
    <div id="health-bar" class="progress-bar"></div>
    <div id="health-display" class="progress-text">Health: 100%</div>
</div>
<div id="stamina-container" class="progress-container">
    <div id="stamina-bar" class="progress-bar"></div>
    <div id="stamina-display" class="progress-text">Stamina: 100%</div>
</div>

<div id="key-container" class="progress-container">
    <div id="key-bar" class="progress-bar"></div>
    <div id="key-display" class="progress-text">Stamina: 100%</div>
</div>

</div>

    
   <div id="bottom-right-image-container">
    <img src="/models/keyFound.png" alt="Key Found Image" id="bottom-right-image-found" height="81" width="81" style="display: none;">
    <img src="/models/keyNo.png" alt="Key Not Found Image" id="bottom-right-image-no" height="81" width="81" style="display: none;">
</div>


     `;

window.addEventListener('load', () => {
    document.getElementById('play-button').style.display = 'none'; // Initially hide the play button

    // Show intro image for 4 seconds
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('introPlay').style.display = 'block';
        document.getElementById('play-button').style.display = 'block';
    }, 5000);

    document.getElementById('play-button').addEventListener('click', () => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
    });
});

