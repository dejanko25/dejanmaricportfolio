using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class pause_menu : MonoBehaviour
{
    public static bool isGamePaused = false;
    public static bool isGameOver = false;
    public static bool isGameWon = false;
    private LevelScore ls;

    public GameObject pauseMenuUI;
    public GameObject quitDialogueUI;
    public GameObject gameOverUI;
    public GameObject gameWonUI;
    //public GameObject loader;
    public Text scoreText;

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape)){
            if (isGamePaused){
                Resume();
            }
            else if(Time.timeScale!=0f){
                Pause();
            }
        }
        if (isGameOver && !isGamePaused) {
            GameOver();
        }
        if (isGameWon && !isGamePaused)
        {
            GameWon();
        }
    }

    public void GameOver() {
        gameOverUI.SetActive(true);
        Time.timeScale = 0f;
        isGamePaused = true;
    }

    public void GameWon()
    {
        gameWonUI.SetActive(true);
        Time.timeScale = 0f;
        isGamePaused = true;
        ls = FindObjectOfType<LevelScore>();
        print(ls.GetScore());
        scoreText.text = "Your score is: " + ls.GetScore();
    }

    public void Resume() {
        pauseMenuUI.SetActive(false);
        quitDialogueUI.SetActive(false);
        Time.timeScale = 1f;
        isGamePaused = false;
    }

    void Pause() {
        pauseMenuUI.SetActive(true);
        Time.timeScale = 0f;
        isGamePaused = true;
    }

    public void Menu()
    {
        Time.timeScale = 1f;
        isGamePaused = false;
        isGameOver = false;
        isGameWon = false;
        SceneManager.LoadScene("Main Menu");
    }

    public void AskQuit()
    {
        pauseMenuUI.SetActive(false);
        quitDialogueUI.SetActive(true);
    }

    public void DontQuit()
    {
        pauseMenuUI.SetActive(true);
        quitDialogueUI.SetActive(false);
    }

    public void QuitGame()
    {
        print("bye!");
        Application.Quit();
    }

    public void Restart()
    {
        Time.timeScale = 1f;
        isGamePaused = false;
        isGameOver = false;
        isGameWon = false;
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    public void LoadNextLevel() {
        Time.timeScale = 1f;
        isGamePaused = false;
        isGameOver = false;
        isGameWon = false;
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }
}
