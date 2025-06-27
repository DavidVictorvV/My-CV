import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityWrapper: React.FC = () => {
  const { unityProvider, isLoaded, loadingProgression, unload } =
    useUnityContext({
      loaderUrl: "/assets/flat.loader.js",
      dataUrl: "/assets/flat.data",
      frameworkUrl: "/assets/flat.framework.js",
      codeUrl: "/assets/flat.wasm",
    });

  //to use in future: https://react-unity-webgl.dev
  //sendMessage can send message to unity

  React.useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!isLoaded && (
        <p
          style={{
            color: "white",
            position: "absolute",
            top: "2rem",
            textAlign: "center",
          }}
        >
          Loading... {(loadingProgression * 100).toFixed(2)}%
        </p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100%",
          height: "100%",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />
    </div>
  );
};

export default UnityWrapper;
