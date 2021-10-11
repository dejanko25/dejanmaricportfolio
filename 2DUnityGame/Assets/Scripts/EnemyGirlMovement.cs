using UnityEngine;

public class EnemyGirlMovement : MonoBehaviour
{
    public CharacterController2D controller;

    public float runSpeed = 15f;
    private Animator anim;
    float horizontalMove = 0f;
    bool jump = false;
    bool crouch = false;
    public float radius = 1f;
    private GameObject player;
    private LevelScore ls;

    private void Start()
    {
        ls = FindObjectOfType<LevelScore>();
        anim = GetComponent<Animator>();
        player = GameObject.Find ("AntiviroWalking");
    }

    void Update()
    {
        if (Mathf.Abs(player.transform.position.x - transform.position.x) < 15)
        {
            if (player.transform.position.x - transform.position.x > 0  && transform.childCount > 0)
            {
                horizontalMove = 1 * runSpeed;
            }
            else
            {
                horizontalMove = -1 * runSpeed;
            }
            
        }

        GetMask();
    }
    
    void FixedUpdate ()
    {
        // Move our character
        controller.Move(horizontalMove * Time.fixedDeltaTime, crouch, jump);
    }

    private void GetMask()
    {
        Collider2D[] results = new Collider2D[1];
        int target = Physics2D.OverlapCircleNonAlloc(transform.position, radius, results, 1 << LayerMask.NameToLayer("MaskShot"));
        if (target > 0)
        {
            if (results[0].CompareTag("Mask") && transform.childCount > 0)
            {
                ls.MaskPerson();
                anim.SetBool("masked", true);
                FindObjectOfType<AudioManager>().Play("EnemyShot");
                Destroy(results[0].gameObject);
                foreach(Transform child in transform)
                {
                    Destroy(child.gameObject);
                }

            }
        }

    }
}
