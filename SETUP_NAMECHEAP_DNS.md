# 🌐 Configure holyverse.ca on Namecheap for GitHub Pages

## Step 1: Log in to Namecheap

1. Go to https://www.namecheap.com/
2. Sign in to your account
3. Go to **Dashboard** → **Domain List**
4. Find `holyverse.ca` and click **Manage**

## Step 2: Access DNS Settings

1. Click on the **Advanced DNS** tab
2. You should see a list of existing DNS records

## Step 3: Add DNS Records

You need to add/modify these records:

### Option A: Using CNAME Record (Recommended for www)

**For www subdomain:**
- **Type:** CNAME Record
- **Host:** www
- **Value:** jeanvq.github.io
- **TTL:** 30 min (or auto)
- Click **✓** (checkmark to save)

### Option B: Using A Records (For root domain)

**Record 1:**
- **Type:** A
- **Host:** @
- **Value:** 185.199.108.153
- **TTL:** 30 min
- Click **✓**

**Record 2:**
- **Type:** A
- **Host:** @
- **Value:** 185.199.109.153
- **TTL:** 30 min
- Click **✓**

**Record 3:**
- **Type:** A
- **Host:** @
- **Value:** 185.199.110.153
- **TTL:** 30 min
- Click **✓**

**Record 4:**
- **Type:** A
- **Host:** @
- **Value:** 185.199.111.153
- **TTL:** 30 min
- Click **✓**

## Step 4: Configure GitHub Pages

1. Go to your GitHub repository: https://github.com/jeanvq/holy_verse
2. Click **Settings**
3. Scroll down to **Pages** section
4. Under **Custom domain**, enter: `holyverse.ca`
5. Check **Enforce HTTPS**
6. Click **Save**

## Step 5: Wait for DNS Propagation

- DNS changes usually take **24-48 hours** to propagate
- You can check status at https://dnschecker.org/
- Search for: `holyverse.ca`

## Step 6: Verify It's Working

After DNS propagates:
1. Visit https://www.holyverse.ca
2. You should see your HolyVerse app
3. GitHub Pages will automatically serve your site

## ⚠️ Important Notes

- **Remove conflicting records:** If you see old A records pointing elsewhere, delete them first
- **TTL:** The lower the TTL (Time To Live), the faster changes propagate
- **HTTPS:** Once configured, GitHub will automatically issue a free SSL certificate
- **Propagation:** You can check DNS propagation at https://www.whatsmydns.net/

## If it Still Doesn't Work

1. **Check CNAME file is correct:**
   - In your repository, there should be a `CNAME` file
   - It should contain only: `holyverse.ca`

2. **Check GitHub Pages settings:**
   - Verify domain is set to `holyverse.ca`
   - Verify HTTPS is enforced

3. **Check DNS records:**
   - Use https://mxtoolbox.com/ to verify your DNS records are set correctly

## Support

If you need more help, contact Namecheap support: https://www.namecheap.com/support/

---

**Current Status:**
- Repository: https://github.com/jeanvq/holy_verse
- Temporary URL: https://jeanvq.github.io/holy_verse
- Custom Domain: holyverse.ca (pending DNS configuration)
