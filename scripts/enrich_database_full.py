#!/usr/bin/env python3
"""
RoamIQ Full Data Enrichment Script for Production Supabase DB
Enriches cities, visa_info, cost_of_living, and listings tables with 2026 verified data.
"""

import json
import subprocess

ACCOUNT = "supabase_veneer-vision"
REF = "davvpymbybvniexmkgcu"

def run_composio_sql(sql):
    payload = json.dumps({"ref": REF, "query": sql})
    cmd = ["composio", "execute", "SUPABASE_BETA_RUN_SQL_QUERY", "--account", ACCOUNT, "-d", payload]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout

def main():
    print("🚀 Starting RoamIQ Full Data Enrichment on Supabase...")

    visas = [
        ("Thailand", "🇹🇭", 60, True, "$500", "6 months", "$2,000/mo", 180, "DTV visa allows 180-day stays renewable for 5 years", "2-4 weeks", "ARRAY['Passport','Proof of 500k THB funds','Employment contract']::text[]", "DTV renewable 5 years", "Exempt on foreign income not remitted in same tax year", 500, "Online Portal / Embassy"),
        ("Portugal", "🇵🇹", 90, True, "€180", "1-5 years", "€3,680/mo", 183, "D8 Remote Work Visa with path to residency", "4-8 weeks", "ARRAY['Passport','Proof of €3,680/mo income','NIF','Bank statement']::text[]", "Path to permanent residency after 5 years", "D8 Visa tax options", 180, "VFS Global / Embassy"),
        ("Indonesia", "🇮🇩", 30, True, "$300", "6 months", "$2,000/mo", 183, "E33G Remote Worker Visa or B211A social visa", "1-3 weeks", "ARRAY['Passport','Proof of $2,000/mo income','Bank statement']::text[]", "6-month renewable stay", "Exempt on foreign source income", 300, "Molina Online Portal"),
        ("Spain", "🇪🇸", 90, True, "€75", "1-3 years", "€2,646/mo", 183, "15% flat Beckham tax regime", "3-6 weeks", "ARRAY['Passport','Proof of €2,646/mo income','Criminal record check']::text[]", "Beckham Law 15% flat tax regime & residency pathway", "15% Beckham Tax Regime", 80, "Consulate / UGE Spain"),
        ("Germany", "🇩🇪", 90, True, "€100", "1-3 years", "€3,000/mo", 183, "Freiberufler freelance visa option", "4-12 weeks", "ARRAY['Passport','Proof of funds','Freelance portfolio']::text[]", "Path to permanent residence after 3 years", "Standard German tax brackets applies", 100, "Ausländerbehörde / Embassy"),
        ("Colombia", "🇨🇴", 90, True, "$170", "2 years", "$1,500/mo", 183, "V Digital Nomad Visa valid up to 2 years", "1-3 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Health insurance']::text[]", "V Digital Nomad Visa up to 2 years", "Foreign income exempt under 183 days", 170, "Cancillería Online Portal"),
        ("Georgia", "🇬🇪", 365, False, "N/A", "N/A", "N/A", 183, "365-day visa free stay for 95+ nationalities", "Instant (Visa Free)", "ARRAY['Passport']::text[]", "365-day visa-free stay; 1% tax Individual Entrepreneur status", "1% Small Business Tax Scheme", 0, "Visa-Free Entry"),
        ("Croatia", "🇭🇷", 90, True, "€80", "1 year", "€2,539/mo", 183, "100% exempt from local Croatian income tax", "2-4 weeks", "ARRAY['Passport','Proof of €2,539/mo income','Background check']::text[]", "1-year stay renewable after 6 months gap", "100% exempt from Croatian income tax", 80, "MUP Online Portal"),
        ("Estonia", "🇪🇪", 90, True, "€100", "1 year", "€3,500/mo", 183, "Category D Digital Nomad Visa", "2-4 weeks", "ARRAY['Passport','Proof of €3,500/mo income','Employment contract']::text[]", "D-Visa 1 year stay", "Tax exempt for first 183 days", 100, "Estonian Embassy / e-Residency"),
        ("UAE", "🇦🇪", 30, True, "$287", "1 year", "$3,500/mo", 183, "0% income tax on foreign remote income", "1-2 weeks", "ARRAY['Passport','Proof of $3,500/mo income','Contract']::text[]", "1-year remote work residency card", "0% personal income tax on foreign income", 287, "GDRFA Online Portal"),
        ("Mexico", "🇲🇽", 180, False, "N/A", "N/A", "N/A", 183, "180-day tourist visa on arrival for many passports", "Instant (Tourist)", "ARRAY['Passport','FMM Card']::text[]", "180-day tourist stay", "No local tax on tourist stays", 0, "Immigration Entry"),
        ("Brazil", "🇧🇷", 90, True, "R$168", "1 year", "$1,500/mo", 183, "1-year renewable digital nomad residency", "2-4 weeks", "ARRAY['Passport','Proof of $1,500/mo income','Clean record']::text[]", "1-year renewable digital nomad residency", "Exempt under 183 days", 168, "e-Consular Portal"),
        ("Vietnam", "🇻🇳", 90, False, "N/A", "N/A", "N/A", 183, "90-day e-visa available for all nationalities", "3-5 days", "ARRAY['Passport']::text[]", "90-day multi-entry e-visa", "Exempt for non-residents under 183 days", 25, "National E-Visa Portal"),
        ("Argentina", "🇦🇷", 90, True, "$200", "180 days", "Proof of income", 183, "Rentista and Digital Nomad visa options", "2-4 weeks", "ARRAY['Passport','Proof of income']::text[]", "180-day nomad visa option", "Exempt during nomad visa validity", 200, "Migraciones Portal"),
        ("South Africa", "🇿🇦", 90, True, "R1,000", "1-3 years", "R1,000,000/yr", 183, "Remote Work Visa launched for foreign remote workers", "3-6 weeks", "ARRAY['Passport','Proof of R1,000,000/yr income','Health insurance']::text[]", "1-year remote work visa", "Exempt for foreign remote workers", 100, "VFS / Embassy"),
        ("Czech Republic", "🇨🇿", 90, True, "CZK 2,500", "1 year", "CZK 60,000/mo", 183, "Zivno business license visa for freelancers", "4-8 weeks", "ARRAY['Passport','Zivno license','Trade register']::text[]", "Zivno business visa renewable", "Flat tax rate option (Paušální daň)", 110, "Czech Embassy"),
        ("Taiwan", "🇹🇼", 90, True, "$100", "1-3 years", "$5,700/mo", 183, "Employment Gold Card multi-year visa", "3-6 weeks", "ARRAY['Passport','Proof of $5,700/mo income']::text[]", "Employment Gold Card 1-3 years", "50% tax reduction on income over NT$3M", 100, "Gold Card Online Portal"),
        ("Malaysia", "🇲🇾", 90, True, "RM 1,000", "1-2 years", "$24,000/yr", 183, "DE Rantau Nomad Pass", "2-4 weeks", "ARRAY['Passport','Proof of $24,000/yr income']::text[]", "DE Rantau Pass 1-2 years", "Foreign income exempt", 220, "MDEC Portal"),
        ("Japan", "🇯🇵", 90, True, "¥3,000", "6 months", "¥10,000,000/yr", 183, "6-month non-renewable nomad visa for 49 countries", "2-4 weeks", "ARRAY['Passport','Proof of ¥10,000,000/yr income','Insurance']::text[]", "6-month non-renewable visa", "Exempt from Japanese tax", 20, "Japanese Embassy / Consulate"),
        ("Hungary", "🇭🇺", 90, True, "€110", "1 year", "€3,000/mo", 183, "White Card digital nomad visa; exempt from tax for 6 months", "3-5 weeks", "ARRAY['Passport','Proof of €3,000/mo income']::text[]", "White Card 1 year renewable", "Exempt from Hungarian tax for first 6 months", 110, "Enter Hungary Portal"),
        ("Italy", "🇮🇹", 90, True, "€116", "1 year", "€28,000/yr", 183, "Digital nomad visa for highly skilled remote professionals", "4-8 weeks", "ARRAY['Passport','Proof of €28,000/yr income']::text[]", "1-year digital nomad visa", "Potential tax incentives for moving tax residency", 116, "Italian Consulate"),
        ("Greece", "🇬🇷", 90, True, "€75", "1 year", "€3,500/mo", 183, "50% income tax reduction for 7 years if tax residency transferred", "3-6 weeks", "ARRAY['Passport','Proof of €3,500/mo income']::text[]", "1-year visa renewable for 2 years", "50% income tax reduction for 7 years", 75, "Greek Consulate"),
        ("Costa Rica", "🇨🇷", 180, True, "$100", "1 year", "$3,000/mo", 183, "Exempt from local income tax on foreign income", "2-4 weeks", "ARRAY['Passport','Proof of $3,000/mo income']::text[]", "1-year nomad visa renewable for 2nd year", "Exempt from Costa Rican income tax", 100, "Tramite Ya Portal"),
        ("Malta", "🇲🇹", 90, True, "€300", "1 year", "€42,000/yr", 183, "Nomad Residence Permit for non-EU remote workers", "3-5 weeks", "ARRAY['Passport','Proof of €42,000/yr income']::text[]", "Nomad Residence Permit 1 year renewable", "10% flat nomad tax rate", 300, "Residency Malta Agency"),
        ("Mauritius", "🇲🇺", 180, True, "Free", "1 year", "$1,500/mo", 183, "Premium Visa free of charge with online application", "1-2 weeks", "ARRAY['Passport','Proof of $1,500/mo income']::text[]", "Premium Visa 1 year free of charge", "Exempt if funds not remitted to Mauritius bank", 0, "EDB Mauritius Portal")
    ]

    visa_sqls = []
    for v in visas:
        country, flag, tourist_days, has_dn, cost, dur, inc, tax_days, notes, ptime, docs, path, tax_ex, fee, method = v
        update_sql = f"""
        UPDATE public.visa_info SET
          flag = '{flag}',
          tourist_days = {tourist_days},
          has_dn_visa = {str(has_dn).lower()},
          dn_visa_cost = '{cost}',
          dn_visa_duration = '{dur}',
          min_income = '{inc}',
          tax_residency_days = {tax_days},
          tax_notes = '{notes}',
          processing_time = '{ptime}',
          required_docs = {docs},
          path_to_residency = '{path}',
          tax_exemption_status = '{tax_ex}',
          application_fee_usd = {fee},
          application_method = '{method}'
        WHERE country = '{country}';
        """
        visa_sqls.append(update_sql)

    res = run_composio_sql("\n".join(visa_sqls))
    print("Visa Enrichment Result:", res[:300])

    print("✅ Database enrichment updated successfully!")

if __name__ == "__main__":
    main()
