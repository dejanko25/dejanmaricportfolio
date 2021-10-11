using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Mask : MonoBehaviour
{
    public float speed = 20f;
    public Rigidbody2D rb;
    public Transform firePoint;
    private GameObject player;

    private float startingX;


    void Start()
    {
        player = GameObject.Find ("AntiviroWalking");
        startingX = player.transform.position.x;
        //  rb.velocity = transform.right * speed;
    }

    Vector3 worldPosition;
    void Update()
    {
       
        if (Mathf.Abs(transform.position.x - startingX) < 10)
        {
            rb.velocity = transform.right * speed;
            
        }
        else
        {
            Destroy(gameObject);
        }

    }

}
