
import os
import subprocess

images = [
    "sbk-diverse-crowd.png", "private-dinner.png", "chateau-wedding.png", "apple-touch-icon.png",
    "logo-footer.png", "dance-hiphop.png", "logo-footer-reset-v1.png", "dance-ballet.png",
    "rebeca-team.jpg", "pet-dog.png", "og-image.jpg", "sbk-detail-feet.png", "winter-wedding-cover.png",
    "corp-woman.png", "winter-detail-decor.png", "sbk-bachata-sensual.png", "testimonial-sophie-v2.png",
    "sbk-caribbean-teachers.png", "corp-presentation.png", "logo-brand.png", "couple-balcony-luxury.png",
    "private-bday.png", "private-reveal.png", "pet-walk.png", "city-engagement.png", "chateau-detail.png",
    "dance-duo.png", "logo-reset-v1.png", "sbk-dance-cover.png", "corp-meeting.png", "logo-brand-v3.png",
    "logo-brand-v2.png", "pet-cat.png", "hero-chateau-sunset.png"
]

search_paths = ["client/src", "client/public/index.html", "client/public/locales"]
unused = []

print("Analyzing image usage...")
for img in images:
    found = False
    # Check regular files
    command = ["grep", "-r", "-q", img] + search_paths
    result = subprocess.run(command, capture_output=True)
    if result.returncode == 0:
        found = True
    
    if not found:
        # Also check just the usage without extension sometimes? No, safer to stick to full name first.
        # But wait, imports might be relative. Grep should catch it unless it's dynamic.
        unused.append(img)
        print(f"❌ UNUSED: {img}")
    else:
        print(f"✅ USED: {img}")

print(f"\nTotal Unused: {len(unused)}")
