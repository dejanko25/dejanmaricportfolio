using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Inventory : MonoBehaviour
{
    public int[] quantity;
    public bool[] isSelected;
    public int peopleToVaccinate;
    public Text maskText;
    public Text vaccText;
    public Text peopleToVaccinateText;
    public GameObject GUIcko;
    public GameObject Time;
    // Start is called before the first frame update
    void Start()
    {
        quantity = new int[2];
        isSelected = new bool[2];
        quantity[0] = 0;
        quantity[1] = 0;
        isSelected[0] = true;
        isSelected[1] = false;
        peopleToVaccinate = 3; // TU SA NASTAVUJE KOLKO LUDI TREBA ZAVAKCINOVAT V DANOM LEVELI
    }

    void Update()
    {
        if (!pause_menu.isGamePaused && !GUIcko.activeSelf)
        {
            GUIcko.SetActive(true);
            Time.GetComponent<Text>().enabled=true;
        }
        else if(pause_menu.isGamePaused && GUIcko.activeSelf)
        {
            GUIcko.SetActive(false);
            Time.GetComponent<Text>().enabled = false;
        }
        maskText.text = "" + quantity[0];
        vaccText.text = "" + quantity[1];
        peopleToVaccinateText.text = "" + peopleToVaccinate + " more to vaccinate";
    }
}
