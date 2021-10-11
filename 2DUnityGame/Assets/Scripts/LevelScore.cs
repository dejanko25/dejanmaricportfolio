using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelScore : MonoBehaviour
{
    public GameObject textDisplay;
    public GameObject scoreDisplay;
    public int secondLeft = 210;
    public bool takingAway = false;
    public bool gameFinished = false;

    public static LevelScore _instance;
    public float _score = 0;

    public static LevelScore Instance
    {
        get => _instance;
    }
    
    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
        }
        else
        {
            _instance = this;
        }
    }
    
    
    IEnumerator TimerTaker()
    {
        takingAway = true;
        yield return new WaitForSeconds(1);
        secondLeft -= 1;

        if (secondLeft > 119)
        {
            var seconds = secondLeft - 120;
            if (seconds < 10)
            {
                textDisplay.GetComponent<Text>().text = "02:0" + seconds;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "02:" + seconds;
            }
        }
        else if (secondLeft > 59)
        {
            var seconds = secondLeft - 60;
            if (seconds < 10)
            {
                textDisplay.GetComponent<Text>().text = "01:0" + seconds;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "01:" + seconds;
            }
        }
        else
        {
            if (secondLeft < 10)
            {
                textDisplay.GetComponent<Text>().text = "00:0" + secondLeft;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "00:" + secondLeft;
            }
        }

        takingAway = false;
    }
    private void Start()
    {
        scoreDisplay.GetComponent<Text>().text = "Score: " + _score;
        if (secondLeft > 120)
        {
            var seconds = secondLeft - 120;
            if (seconds < 10)
            {
                textDisplay.GetComponent<Text>().text = "02:0" + seconds;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "02:" + seconds;
            }
        }
        else if (secondLeft > 60)
        {
            var seconds = secondLeft - 60;
            if (seconds < 10)
            {
                textDisplay.GetComponent<Text>().text = "01:0" + seconds;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "01:" + seconds;
            }
        }
        else
        {
            if (secondLeft < 10)
            {
                textDisplay.GetComponent<Text>().text = "00:0" + secondLeft;
            }
            else
            {
                textDisplay.GetComponent<Text>().text = "00:" + secondLeft;
            }
        }
    }
    
    public void VaccinatePerson()
    {
        _score += 100;
        scoreDisplay.GetComponent<Text>().text = "Score: " + _score;
    }
    
    public void MaskPerson()
    {
        _score += 50;
        scoreDisplay.GetComponent<Text>().text = "Score: " + _score;
    }

    public void FinishLevel()
    {
        if (gameFinished == false)
        {
            gameFinished = true;
            _score += (secondLeft * 5);
            scoreDisplay.GetComponent<Text>().text = "Score: " + _score;
            StartCoroutine(GameCompleted());
        }
    }
    
    IEnumerator GameCompleted()
    {
        yield return new WaitForSeconds(1);
        pause_menu.isGameWon = true;
    }
    
    private void Update()
    {
        if (takingAway == false && secondLeft > 0)
        {
            StartCoroutine(TimerTaker());
        }
        if (secondLeft == 0) pause_menu.isGameOver = true;
    }
    
    public void AddTime()
    {
        secondLeft += 10;
    }

    public float GetScore()
    {
        return _score;
    }

}
