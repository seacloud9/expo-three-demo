import Expo from 'expo';
import React from 'react';
import { View, Text } from 'react-native';
import ExpoTHREE from 'expo-three';
import ThreeView from '../ThreeView';

import Touches from '../window/Touches';

import AnyLoader from '../utils/AnyLoader';

class App extends React.Component {

    render = () => (
        <ThreeView
            style={{ flex: 1 }}
            onContextCreate={this._onContextCreate}
            render={this._animate}
        />
    );

    _onContextCreate = async (gl) => {

        const { innerWidth: width, innerHeight: height, devicePixelRatio: scale } = window;

        // renderer

        this.renderer = ExpoTHREE.createRenderer({ gl });
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x339ce2);

        // scene
        this.scene = new THREE.Scene();
        // camera

        this.camera = new THREE.PerspectiveCamera(25, width / height, 1, 10000);
        this.camera.position.set(15, 10, - 15);
        this.camera.lookAt(new THREE.Vector3());

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.target.set(0, 2, 0);
        this.controls.update();
        // custom scene

        await this._setupScene();

        // resize listener

        window.addEventListener('resize', this._onWindowResize, false);
    }

    _setupScene = async () => {
        const { innerWidth: width, innerHeight: height } = window;
        // Initialize Three.JS

        const asset = Expo.Asset.fromModule(require('../assets/models/stormtrooper/stormtrooper.dae'));
        if (!asset.localUri) {
            await asset.downloadAsync();
        }

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        // loader.setCrossOrigin('assets/models/stormtrooper/');
        loader.load(asset.localUri, (collada) => {
            const animations = collada.animations;
            const avatar = collada.scene;
            this.mixer = new THREE.AnimationMixer(avatar);
            const action = this.mixer.clipAction(animations[0]).play();
            this.scene.add(avatar);

            var helper = new THREE.SkeletonHelper( avatar );
            helper.material.linewidth = 3;
            this.scene.add( helper );
        
        });
        //
        var gridHelper = new THREE.GridHelper(10, 20);
        this.scene.add(gridHelper);
        //
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, - 1);
        this.scene.add(directionalLight);

    }

    _onWindowResize = () => {
        const { innerWidth: width, innerHeight: height, devicePixelRatio: scale } = window;

        // On Orientation Change, or split screen on android.
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Update Renderer
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
    }

    _animate = (delta) => {

        this.controls.update();

        if (this.mixer !== undefined) {
            
            this.mixer.update(delta);
        }


        this._render();
    }

    _render = () => {
        // Render Scene!
        this.renderer.render(this.scene, this.camera);
    }
}

// Wrap Touches Event Listener
export default Touches(App);