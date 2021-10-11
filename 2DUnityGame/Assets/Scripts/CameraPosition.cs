using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraPosition : MonoBehaviour
{
    private GameObject player;
    // Start is called before the first frame update
    void Start()
    {
        player = GameObject.Find ("AntiviroWalking");
    }

    // Update is called once per frame
    void Update()
    {
        if (player.transform.position.y > 2.5)
            transform.position = new Vector3(player.transform.position.x, player.transform.position.y, -10);
        else
            transform.position = new Vector3(player.transform.position.x, 0, -10);
    }
}
