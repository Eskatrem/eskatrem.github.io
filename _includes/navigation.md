<p>
{% assign foundRev = 0 %}
{% assign reversed = site.shogi_pages_order | reverse %}
{% for p in reversed %}
{% if foundRev == 1 %}
{% for x in site.shogi %}
{% if x.short_title == p %}
<a href = "{{ x.url }}">Previous</a>
{% endif %}
{% endfor %}
{% assign foundRev = 0 %}
{% endif %}
{% if p == page.short_title %}
{% assign foundRev = 1 %}
{% endif %}
{% endfor %}
{% assign found = 0 %}
{% for p in site.shogi_pages_order %}
{% if found == 1 %}
{% for x in site.shogi %}
{% if x.short_title == p %}
<span style="padding-left:20px"></span>
<a href = "{{ x.url }}">Next</a>
{% endif %}
{% endfor %}
{% assign found = 0 %}
{% endif %}
{% if p == page.short_title %}
{% assign found = 1 %}
{% endif %}
{% endfor %}
</p>
