please change the entire apps colors from the coral pink (#FF6B6B) and turquoise (#4ECDC4) colors to the colors below


5-stop vertical gradient from the screen (top → bottom)

Color stops:  
• 0%: #3F1A6C → rgb(63, 26, 108)  
• 25%: #5C1F99 → rgb(92, 31, 153)  
• 50%: #8623CB → rgb(134, 35, 203)  
• 75%: #C1289C → rgb(193, 40, 156)  
• 100%: #E9297E → rgb(233, 41, 126)

CSS example (prettified):

```css
.background {
  background: linear-gradient(
    180deg,
    #3F1A6C 0%,
    #5C1F99 25%,
    #8623CB 50%,
    #C1289C 75%,
    #E9297E 100%
  );
}
```

glass morphism effects with:
15% white background opacity
10px backdrop blur
White border with 20% opacity
Box shadow for depth