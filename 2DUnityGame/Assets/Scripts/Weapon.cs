using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Weapon : MonoBehaviour
{
    public Transform firePoint;
    public GameObject maskPrefab;
    private Inventory inventory;
    
    void Start()
    {
        inventory = GameObject.FindGameObjectWithTag("Player").GetComponent<Inventory>();
    }
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            if (inventory.isSelected[0] && inventory.quantity[0] > 0 && !pause_menu.isGamePaused)
            {
                print( inventory.quantity[0]);
                Shoot();
            }
            
        }
    }

    void Shoot()
    {
        FindObjectOfType<AudioManager>().Play("Shot");
        inventory.quantity[0] -= 1;
        print( inventory.quantity[0]);
        Instantiate(maskPrefab, firePoint.position, firePoint.rotation);

    }
}