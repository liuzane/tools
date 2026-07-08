
### Explanation

A complete format line is as follows:

`Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding`

A complete style line is as follows:

`Style: Default,Microsoft YaHei,24,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,1,2,5,5,5,1`

The contents of the format line and the style line correspond one‑to‑one. The format line defines how each field in the style is to be interpreted; therefore, the format line must appear before any style lines, and the field names listed in it must be spelled correctly. The format line allows new fields to be added to the script format in the future, and it allows older software to read the fields it recognises – even if the field order changes. It includes the following 23 fields:

1. **Name**  
   **Description:** The unique identifier for the style. Subtitle event lines reference this name to apply the style.  
   **Examples:** `Default`, `Title`, `MainCharacter`, `TopComment`

2. **Fontname**  
   **Description:** Specifies the font used for subtitles. Must be an installed system font name.  
   **Examples:** `Arial`, `Microsoft YaHei`, `SimSun`, `Times New Roman`

3. **Fontsize**  
   **Description:** The height of the font, in pixels.  
   **Examples:** `20`, `36`, `48`

4. **PrimaryColour**  
   **Description:** The main colour of the subtitle text, usually the fill colour.  
   **Format:** `BBGGRR` (Blue‑Green‑Red, hexadecimal). **Note the order is BGR, not RGB.**  
   **Alpha channel:** In some implementations, an alpha (transparency) value can follow the colour, formatted as `&HBBGGRR&`, with the alpha value placed after `&H` as `AABBGGRR`.  
   **Examples:**  
   - `&H000000&` – black  
   - `&HFFFFFF&` – white  
   - `&HFF0000&` – blue (because of BGR order)  
   - `&H0000FF&` – red

5. **SecondaryColour**  
   **Description:** In karaoke effects, this colour is used for the portion of the text that has not yet been sung. In non‑karaoke situations, this attribute is generally unused but must still be defined.

6. **OutlineColour**  
   **Description:** The colour of the outline (stroke) around the subtitle text.

7. **BackColour**  
   **Description:** The colour of the shadow behind the subtitle text.

8. **Bold**  
   **Description:** Whether bold style is enabled.  
   **Values:** `-1` = enabled (yes), `0` = disabled (no).

9. **Italic**  
   **Description:** Whether italic style is enabled.  
   **Values:** `-1` = enabled (yes), `0` = disabled (no).

10. **Underline**  
    **Description:** Whether underline is enabled.  
    **Values:** `-1` = enabled (yes), `0` = disabled (no).

11. **StrikeOut**  
    **Description:** Whether strikethrough is enabled.  
    **Values:** `-1` = enabled (yes), `0` = disabled (no).

12. **ScaleX**  
    **Description:** Horizontal scaling of the text width, with 100 as the base (100%).  
    **Examples:** `100` (normal), `150` (1.5× width), `80` (1.8× width). *(Note: as written in the original)*

13. **ScaleY**  
    **Description:** Vertical scaling of the text height, with 100 as the base (100%).  
    **Examples:** `100` (normal), `150` (1.5× height), `80` (1.8× height). *(Note: as written in the original)*

14. **Spacing**  
    **Description:** Extra spacing between characters, in pixels. Can be negative.  
    **Examples:** `0` (normal), `2` (adds 2 pixels), `-1` (reduces by 1 pixel).

15. **Angle**  
    **Description:** The rotation angle of the text around the Z‑axis (perpendicular to the screen), in degrees. Positive values denote counter‑clockwise rotation.  
    **Examples:** `0` (no rotation), `45` (counter‑clockwise 45°), `-90` (clockwise 90°).

16. **BorderStyle**  
    **Description:** A very important attribute that determines the rendering mode of the subtitle.  
    **Values:**  
    - `1`: **Outline with shadow** – the most common and clearest mode. The text is outlined first, then a shadow is added behind/below it.  
    - `3`: **Opaque box** – the text appears inside an opaque rectangular box; the box colour is determined by `BackColour`. Often used to ensure readability against any background.  
    - `4`: **Outline only, no shadow**.

17. **Outline**  
    **Description:** When `BorderStyle` is `1` or `4`, the width of the text outline in pixels.  
    **Examples:** `1` (thin outline), `3` (thick outline). Usually `2` or `3` are common choices.

18. **Shadow**  
    **Description:** When `BorderStyle` is `1`, the offset distance of the text shadow in pixels.  
    **Examples:** `0` (no shadow), `2` (shadow offset 2 pixels down‑right), `-2` (shadow offset 2 pixels up‑left).

19. **Alignment**  
    **Description:** The alignment of the subtitle on the screen. This is a numeric code and is very important.  
    **Values (numeric meanings):**  
    - `1` – Bottom left  
    - `2` – Bottom center  
    - `3` – Bottom right  
    - `4` – Middle left  
    - `5` – Middle center  
    - `6` – Middle right  
    - `7` – Top left  
    - `8` – Top center  
    - `9` – Top right  
    **Note:** Some players or scripts may use numbers `10+` to indicate alignment relative to the subtitle margins, but `1–9` are the most universal and standard.

20. **MarginL, MarginR, MarginV** (Margins)  
    **Description:** Define the “safe area” for subtitles, in pixels.  
    - `MarginL`: Left margin – the minimum distance from the left edge of the screen.  
    - `MarginR`: Right margin – the minimum distance from the right edge of the screen.  
    - `MarginV`: Vertical margin – its meaning depends on `Alignment`:  
      - For bottom alignment (`1, 2, 3`): distance from the bottom of the screen.  
      - For top alignment (`7, 8, 9`): distance from the top of the screen.  
      - For middle alignment (`4, 5, 6`): usually ignored.

21. **Encoding**  
    **Description:** The character encoding used by the font. This attribute is less used in modern applications, as Unicode (e.g., UTF‑8) has become the standard.  
    **Examples:**  
    - `0` – ANSI (e.g., GB2312, Big5)  
    - `1` – Default  
    - `128` – Shift‑JIS (Japanese)  
    - `134` – GB2312 (Simplified Chinese)  
    - `136` – Big5 (Traditional Chinese)  
    - `1` or `0` usually works for most cases, but it is recommended to save subtitle files in UTF‑8 format.
