using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public CharacterController2D controller;
    [SerializeField] private LayerMask m_WhatIsGround;	
    [SerializeField] private Transform m_GroundCheck;
   
    public float runSpeed = 40f;
    private Animator anim;
    float horizontalMove = 0f;
    bool jump = false;
    bool crouch = false;
    public float radiusPlayer = 1f;
    private bool antiviroDead = false;
    private LevelScore ls;

    private bool isGrounded;
    const float k_GroundedRadius = .2f;

    private Inventory inventory;
    private SpriteChanger spriteChanger;

    private void Start()
    {
        ls = FindObjectOfType<LevelScore>();
        anim = GetComponent<Animator>();
        inventory = GameObject.FindGameObjectWithTag("Player").GetComponent<Inventory>();
    }

    void Update()
    {
        if (pause_menu.isGamePaused) {return;}
        horizontalMove = Input.GetAxisRaw("Horizontal") * runSpeed;

        if (Input.GetButtonDown("Alpha1") && inventory.isSelected[1])
        {
            inventory.isSelected[0] = true;
            inventory.isSelected[1] = false;
            spriteChanger = GameObject.Find("MaskUI").GetComponent<SpriteChanger>();
            spriteChanger.ChangeSprite();
            spriteChanger = GameObject.Find("VaccineUI").GetComponent<SpriteChanger>();
            spriteChanger.ChangeSprite();
        }

        if (Input.GetButtonDown("Alpha2") && inventory.isSelected[0])
        {
            inventory.isSelected[0] = false;
            inventory.isSelected[1] = true;
            spriteChanger = GameObject.Find("MaskUI").GetComponent<SpriteChanger>();
            spriteChanger.ChangeSprite();
            spriteChanger = GameObject.Find("VaccineUI").GetComponent<SpriteChanger>();
            spriteChanger.ChangeSprite();
        }

        if (Input.GetKeyDown(KeyCode.E))
        {
            if (inventory.isSelected[0])
            {
                // strielanie
            }
        }

        if (Input.GetButtonDown("Jump"))
        {
            jump = true;
            FindObjectOfType<AudioManager>().Play("Jump");
            anim.SetTrigger("takeOf");
        }

        if (Input.GetKeyDown(KeyCode.S))
            {
                crouch = true;
                Vector3 theScale = transform.localScale;
                theScale.y = 0.7f;
                transform.localScale = theScale;
            }
            else if (Input.GetKeyUp(KeyCode.S))
            {
                crouch = false; //ked sa pustim s
                Vector3 theScale = transform.localScale;
                theScale.y = 1.0f;
                transform.localScale = theScale;
            }
            
        float moveInput = Input.GetAxisRaw("Horizontal");

        if (moveInput == 0)
        {
            anim.SetBool("isRunning", false);
        }
        else
        {
            anim.SetBool("isRunning", true);
        }

        isGrounded = false;
        Collider2D[] colliders = Physics2D.OverlapCircleAll(m_GroundCheck.position, k_GroundedRadius, m_WhatIsGround);
        for (int i = 0; i < colliders.Length; i++)
        {
            if (colliders[i].gameObject != gameObject)
                isGrounded = true;
        }
        if (isGrounded)
        {
            anim.SetBool("isJumping", true);
        }
        else
        {
            anim.SetBool("isJumping", false);
        }
         GetInfected();
         IsFinish();
         EatHoralka();
    }
    
    void FixedUpdate ()
    {
        // Move our character
        controller.Move(horizontalMove * Time.fixedDeltaTime, crouch, jump);
        jump = false; //aby sme nejumpovali forever
    }

    private void GetInfected()
    {
        Collider2D[] results = new Collider2D[1];
        int target = Physics2D.OverlapCircleNonAlloc(transform.position, radiusPlayer, results, 1 << LayerMask.NameToLayer("VirusRadius"));
        if (target > 0 && antiviroDead == false)
        {
            if (results[0].CompareTag("Virus"))
            {
                antiviroDead = true;
                anim.SetTrigger("dead");
                StartCoroutine(KillAntiviro());
            }
        }

    }
    
    IEnumerator KillAntiviro()
    {
        FindObjectOfType<AudioManager>().Play("AntiviroDeath");
        yield return new WaitForSeconds(1);
        pause_menu.isGameOver = true;
    }
    
    private void IsFinish()
    {
        Collider2D[] results = new Collider2D[1];
        int target = Physics2D.OverlapCircleNonAlloc(transform.position, radiusPlayer, results, 1 << LayerMask.NameToLayer("Finish"));
        if (target > 0)
        {
            if (results[0].CompareTag("finish"))
            {
                ls.FinishLevel();
            }
        }

    }
    
    private void EatHoralka()
    {
        Collider2D[] results = new Collider2D[1];
        int target = Physics2D.OverlapCircleNonAlloc(transform.position, radiusPlayer, results, 1 << LayerMask.NameToLayer("Horalka"));
        if (target > 0)
        {
            if (results[0].CompareTag("horalkacas"))
            {
                results[0].gameObject.SetActive(false);
                ls.AddTime();
            }
        }

    }
    
}
