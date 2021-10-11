using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpriteChanger : MonoBehaviour
{
    public SpriteRenderer spriteRenderer;
    public Sprite firstSprite;
    public Sprite secondSprite;

    public void ChangeSprite()
    {
        if (spriteRenderer.sprite == firstSprite)
        {
            spriteRenderer.sprite = secondSprite;
        }
        else
        {
            spriteRenderer.sprite = firstSprite;
        }
    }
}
