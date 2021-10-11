using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BackgroundHelper : MonoBehaviour
{
    public float speed = 1;
    float pos = 0;
    private RawImage _image;
    // Start is called before the first frame update
    void Start()
    {
        _image = GetComponent<RawImage>();
    }

    // Update is called once per frame
    void Update()
    {
        pos += 0;

        if (pos > 1.0F)

            pos -= 1.0F;

        _image.uvRect = new Rect(pos, 0, 1, 1);
    }
}
