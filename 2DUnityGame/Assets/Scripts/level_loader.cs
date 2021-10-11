using System.Collections;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class level_loader : MonoBehaviour
{
    public GameObject loadingScreen;
    public GameObject loaderCanvas;
    public GameObject otherCanvas;
    public Slider slider;

    void Start() {
        //DontDestroyOnLoad(this.gameObject);
        DontDestroyOnLoad(loaderCanvas);
    }

    public void LoadLevel(string scene) {
        otherCanvas.SetActive(false);
        loaderCanvas.SetActive(true);
        loadingScreen.SetActive(true);
        StartCoroutine(AsyncLoad(scene));
    }

    IEnumerator AsyncLoad(string scene){
        AsyncOperation loading = SceneManager.LoadSceneAsync(scene);
        pause_menu.isGamePaused = true;
        Time.timeScale = 0f;
        while (!loading.isDone) {
            print(loading.progress / 0.9f * 100f + "%");
            slider.value = loading.progress / 0.9f;
            yield return null;
        }
        print("loading done...waiting for 7 seconds...");
        yield return new WaitForSecondsRealtime(7);
        loadingScreen.SetActive(false);
        yield return new WaitForSecondsRealtime(0.1f);
        print("oke");
        Time.timeScale = 1f;
        pause_menu.isGamePaused = false;
    }
}
