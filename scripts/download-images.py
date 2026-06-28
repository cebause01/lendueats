"""Download item-accurate food images from Unsplash into /public/images."""
from __future__ import annotations

import os
import urllib.error
import urllib.request

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# Each entry: local path -> (Unsplash photo slug, item label for logging)
DOWNLOADS: dict[str, tuple[str, str]] = {
    # ── Cafes ──────────────────────────────────────────────────────────────
    # cafe-1.jpg — local photo (Cafe Bentara / Dewan Bentara, UiTM Lendu)
    # cafe-2.jpg — local photo (Dewan Laksamana, UiTM Lendu)
    # cafe-3.jpg — local photo (Cafe Jebat, UiTM Lendu)
    # cafe-4.jpg — local photo (Cafe Tun Sabariah, UiTM Lendu)
    # cafe-5.jpg — local photo (Cafe Sunshine, UiTM Lendu)
    "cafes/cafe-6.jpg": (
        "photo-1677921755291-c39158477b8e",
        "Pakya Sinar – nasi lemak",
    ),
    # cafe-7.jpg — local photo (Cafe Richiamo, UiTM Lendu)
    # cafe-8.jpg — local photo (Cafe Pedas Manis, UiTM Lendu)
    # ── Menu items (matched to menu name) ───────────────────────────────────
    "menu/m-1.jpg": (
        "photo-1741241857887-321f7fbcacf2",
        "Nasi Ayam Berempah – Hainanese chicken rice",
    ),
    "menu/m-2.jpg": (
        "photo-1568901346375-23c9450c58cd",
        "Burger Daging Special – beef burger",
    ),
    "menu/m-3.jpg": (
        "photo-1680675494363-75bbf9838a09",
        "Mee Goreng Mamak – fried noodles",
    ),
    "menu/m-4.jpg": (
        "photo-1768703321808-be77e535a523",
        "Teh Tarik – Malaysian milk tea",
    ),
    "menu/m-5.jpg": (
        "photo-1602143407151-7111542de6e8",
        "Air Kosong – mineral water bottle",
    ),
    "menu/m-6.jpg": (
        "photo-1677921755291-c39158477b8e",
        "Nasi Lemak Biasa",
    ),
    "menu/m-7.jpg": (
        "photo-1596797038530-2c107229654b",
        "Nasi Lemak Ayam Goreng – nasi lemak plate",
    ),
    "menu/m-8.jpg": (
        "photo-1626804475297-41608ea09aeb",
        "Roti Canai Kosong – flatbread",
    ),
    "menu/m-9.jpg": (
        "photo-1649067842726-a5c973a3a62c",
        "Milo Ais – iced chocolate drink",
    ),
    "menu/m-10.jpg": (
        "photo-1461023058943-07fcbe16d735",
        "Latte – latte art",
    ),
    "menu/m-11.jpg": (
        "photo-1572442388796-11668a67e53d",
        "Caramel Macchiato – layered coffee",
    ),
    "menu/m-12.jpg": (
        "photo-1555507036-ab1f4038808a",
        "Croissant Butter",
    ),
    "menu/m-13.jpg": (
        "photo-1607958996333-41aef7caefaa",
        "Blueberry Muffin",
    ),
    "menu/m-14.jpg": (
        "photo-1528735602780-2552fd46c7af",
        "Sandwich Tuna – tuna sandwich",
    ),
    "menu/m-15.jpg": (
        "photo-1559827260-dc66d52bef19",
        "Mineral Water 1.5L – large water bottle",
    ),
    "menu/m-16.jpg": (
        "photo-1481391319762-47dff72954d9",
        "Potato Chips – chips",
    ),
    "menu/m-17.jpg": (
        "photo-1680675494363-75bbf9838a09",
        "Nasi Goreng Pedas – fried rice",
    ),
    "menu/m-18.jpg": (
        "photo-1596797038530-2c107229654b",
        "Ayam Masak Merah – chicken rice",
    ),
    "menu/m-19.jpg": (
        "photo-1546069901-ba9599a7e63c",
        "Nasi Goreng Kampung",
    ),
    "menu/m-20.jpg": (
        "photo-1741241857887-321f7fbcacf2",
        "Ayam Goreng Berempah",
    ),
    "menu/m-21.jpg": (
        "photo-1768703321808-be77e535a523",
        "Teh O Ais",
    ),
    "menu/m-22.jpg": (
        "photo-1677921755291-c39158477b8e",
        "Nasi Campur",
    ),
    "menu/m-23.jpg": (
        "photo-1633271332313-04df64c0105b",
        "Sup Tulang",
    ),
    "menu/m-24.jpg": (
        "photo-1649067842726-a5c973a3a62c",
        "Sirap Bandung",
    ),
    "menu/m-25.jpg": (
        "photo-1626804475297-41608ea09aeb",
        "Roti Telur",
    ),
    "menu/m-26.jpg": (
        "photo-1633271332313-04df64c0105b",
        "Mee Sup",
    ),
    "menu/m-27.jpg": (
        "photo-1509042239860-f550ce710b93",
        "Nescafe Ais",
    ),
    "menu/m-28.jpg": (
        "photo-1680675494363-75bbf9838a09",
        "Nasi Goreng Pattaya",
    ),
    "menu/m-29.jpg": (
        "photo-1744444202869-54debf97b285",
        "Ayam Penyet",
    ),
    "menu/m-30.jpg": (
        "photo-1559827260-dc66d52bef19",
        "Limau Ais",
    ),
    "menu/m-31.jpg": (
        "photo-1461023058943-07fcbe16d735",
        "Cappuccino",
    ),
    "menu/m-32.jpg": (
        "photo-1528735602780-2552fd46c7af",
        "Chicken Mayo Sandwich",
    ),
    "menu/m-33.jpg": (
        "photo-1565958011703-44f9829ba187",
        "Chocolate Cake Slice",
    ),
    "menu/m-34.jpg": (
        "photo-1680675494363-75bbf9838a09",
        "Nasi Goreng USA",
    ),
    "menu/m-35.jpg": (
        "photo-1741241857887-321f7fbcacf2",
        "Ayam Popcorn",
    ),
    "menu/m-36.jpg": (
        "photo-1509042239860-f550ce710b93",
        "Kopi O Panas",
    ),
    "menu/m-37.jpg": (
        "photo-1509042239860-f550ce710b93",
        "Americano",
    ),
    "menu/m-38.jpg": (
        "photo-1555507036-ab1f4038808a",
        "Garlic Cheese Bread",
    ),
    "menu/m-39.jpg": (
        "photo-1649067842726-a5c973a3a62c",
        "Iced Chocolate",
    ),
    "menu/m-40.jpg": (
        "photo-1540189549336-e6e99c3679fe",
        "Sambal Udang",
    ),
    "menu/m-41.jpg": (
        "photo-1551024506-0bccd828d307",
        "Cendol",
    ),
    "menu/m-42.jpg": (
        "photo-1569718212165-3a8278d5f624",
        "Mee Rebus",
    ),
    # ── Rewards (reuse matching food photos) ─────────────────────────────────
    "rewards/r-1.jpg": (
        "photo-1768703321808-be77e535a523",
        "Free Teh Tarik",
    ),
    "rewards/r-2.jpg": (
        "photo-1461023058943-07fcbe16d735",
        "Free Latte",
    ),
    "rewards/r-3.jpg": (
        "photo-1556742049-0cfed4f6a45d",
        "RM3 Off – payment / voucher",
    ),
    "rewards/r-4.jpg": (
        "photo-1607082348824-0a96f2a4b9da",
        "RM5 Off – gift voucher",
    ),
    "rewards/r-5.jpg": (
        "photo-1677921755291-c39158477b8e",
        "Free Nasi Lemak",
    ),
    "rewards/r-6.jpg": (
        "photo-1556740758-90de374c12ad",
        "10% Off – discount tag",
    ),
    # ── Promos ─────────────────────────────────────────────────────────────
    "promos/p-1.jpg": (
        "photo-1556742049-0cfed4f6a45d",
        "Double points promo – loyalty",
    ),
    "promos/p-2.jpg": (
        "photo-1414235077428-338989a2e8c0",
        "Pre-order promo – restaurant dining",
    ),
}


def build_url(photo_slug: str, width: int = 800, height: int = 600) -> str:
    return (
        f"https://images.unsplash.com/{photo_slug}"
        f"?auto=format&fit=crop&w={width}&h={height}&q=85"
    )


def verify(url: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=20) as resp:
            return resp.status == 200 and int(resp.headers.get("Content-Length", 1)) > 0
    except urllib.error.HTTPError:
        return False


def main() -> None:
    failed: list[str] = []

    for rel_path, (slug, label) in DOWNLOADS.items():
        is_wide = rel_path.startswith("promos/")
        url = build_url(
            slug,
            width=800 if is_wide else 600,
            height=400 if is_wide else 600,
        )
        dest = os.path.join(BASE, rel_path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        print(f"* {label}")
        print(f"  {rel_path}")

        if not verify(url):
            print(f"  FAIL (URL not reachable): {url}")
            failed.append(rel_path)
            continue

        urllib.request.urlretrieve(url, dest)
        size_kb = os.path.getsize(dest) // 1024
        print(f"  OK ({size_kb} KB)")

    if failed:
        print(f"\n{len(failed)} image(s) failed:")
        for path in failed:
            print(f"  - {path}")
        raise SystemExit(1)

    print(f"\nDone – {len(DOWNLOADS)} images saved to public/images/")


if __name__ == "__main__":
    main()
