using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ItemsPickUp : MonoBehaviour
{

    private Inventory inventory;
    public bool canVaccinate = false;
    private Collider2D starec;
    private LevelScore ls;

    // Start is called before the first frame update
    void Start()
    {
        ls = FindObjectOfType<LevelScore>();
        inventory = GameObject.FindGameObjectWithTag("Player").GetComponent<Inventory>();
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("maskToPick") && other.gameObject.activeSelf)
        {
            other.gameObject.SetActive(false);
            FindObjectOfType<AudioManager>().Play("NewItem");
            inventory.quantity[0] = inventory.quantity[0] + 5;
            print(inventory.quantity[0]);
        }
        else if (other.CompareTag("vaccineToPick") && other.gameObject.activeSelf)
        {
            other.gameObject.SetActive(false);
            FindObjectOfType<AudioManager>().Play("NewItem");
            inventory.quantity[1] = inventory.quantity[1] + 1;
            print(inventory.quantity[1]);
        }
        else if (other.CompareTag("isVaccinable") && other.GetComponent<CircleCollider2D>().GetType() == typeof(CircleCollider2D))
        {
            canVaccinate = true;
            starec = other;
        }
    }

    /*void OnTriggerStay2D(Collider2D other)
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            if (other.CompareTag("isVaccinable"))
            {
                //other.gameObject.SetActive(false);
                inventory.quantity[1] -= 1;
                print("ZAOCKOVANY");
               // canVaccinate = false;
            }
        }
    }*/

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("isVaccinable") && other.GetComponent<CircleCollider2D>().GetType() == typeof(CircleCollider2D))
        {
            canVaccinate = false;
        }
    }

     void Update()
    {
        if (canVaccinate && inventory.isSelected[1] && inventory.quantity[1] > 0)
        {
            if (Input.GetKeyDown(KeyCode.E))
            {
                ls.VaccinatePerson();
                FindObjectOfType<AudioManager>().Play("Syringe");
                starec.gameObject.SetActive(false);
                inventory.quantity[1] -= 1;
                inventory.peopleToVaccinate -= 1;
                print("ZAOCKOVANY");
                canVaccinate = false;
            }
        }
    }

}
