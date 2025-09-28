import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

// CORS headers to allow requests from your web app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    const filePath = record.path_tokens.join('/'); // e.g., "deliverables/12345-myfile.png"
    const bucketId = record.bucket_id;

    // We only want to process files in the 'deliverables' bucket
    if (bucketId !== 'deliverables') {
      return new Response(JSON.stringify({ message: 'Not a deliverable, skipping.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Create a Supabase client with the service_role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download the original file from storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(bucketId)
      .download(filePath);

    if (downloadError) throw downloadError;

    // --- Watermarking Logic ---
    const image = await Image.decode(await fileData.arrayBuffer());
    const watermarkText = "PREVIEW";
    
    // Load a font (You might need to add a font file to your function directory)
    // For simplicity, we use a built-in font
    const font = Image.FONT_JGI_32;

    // Add the watermark text, centered on the image
    image.drawText(
      watermarkText,
      (image.width / 2) - (Image.measureText(font, watermarkText) / 2),
      (image.height / 2) - 16, // Center vertically
      font,
      0xffffffff, // White color
      0.5 // Opacity
    );
    
    // Encode the watermarked image as a PNG
    const watermarkedImageBuffer = await image.encode();

    // --- Upload the Watermarked Preview ---
    const previewPath = `previews/${filePath}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketId)
      .upload(previewPath, watermarkedImageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // --- Update the Database with the preview_url ---
    // Get the public URL for the newly uploaded preview
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketId)
      .getPublicUrl(previewPath);

    // Find the deliverable record by its original file_url and update it
    const originalFileUrl = supabaseAdmin.storage.from(bucketId).getPublicUrl(filePath).data.publicUrl;
    const { error: dbError } = await supabaseAdmin
      .from('deliverables')
      .update({ preview_url: publicUrlData.publicUrl })
      .eq('file_url', originalFileUrl);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, previewPath }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});