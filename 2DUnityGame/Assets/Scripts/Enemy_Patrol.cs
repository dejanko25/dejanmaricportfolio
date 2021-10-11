using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy_Patrol : MonoBehaviour
{
    public float walkSpeed;
    public float distance;
    public CharacterController2D controller;

    [HideInInspector] public bool mustPatrol;
    private bool movingRight = true;
    public Transform groundDetection;

    public float radius = 1f;
    private GameObject player;
    private LevelScore ls;
    private Animator anim;

    void Start()
    {
        mustPatrol = true;
        ls = FindObjectOfType<LevelScore>();
        anim = GetComponent<Animator>();
        player = GameObject.Find("AntiviroWalking");
    }

    void Update()
    {
        transform.Translate(Vector2.right * walkSpeed * Time.deltaTime);
        RaycastHit2D groundInfo = Physics2D.Raycast(groundDetection.position, Vector2.down, distance);
        if (groundInfo.collider == false)
        {
            if (movingRight == true)
            {
                transform.eulerAngles = new Vector3(0, -180, 0);
                movingRight = false;
            }
            else
            {
                transform.eulerAngles = new Vector3(0, 0, 0);
                movingRight = true;
            }
        }
        GetMask();
    }

    private void GetMask()
    {
        Collider2D[] results = new Collider2D[1];
        int target = Physics2D.OverlapCircleNonAlloc(transform.position, radius, results,
            1 << LayerMask.NameToLayer("MaskShot"));
        if (target > 0)
        {
            if (results[0].CompareTag("Mask") && transform.childCount > 0)
            {
                ls.MaskPerson();
                anim.SetBool("masked", true);
                FindObjectOfType<AudioManager>().Play("EnemyShot");
                Destroy(results[0].gameObject);
                foreach (Transform child in transform)
                {
                    if (child.gameObject.name != "GroundCheck")
                        Destroy(child.gameObject);
                }
            }
        }
    }

}
    

